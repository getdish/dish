use crossbeam_channel::unbounded;
use std::env;
use std::io;
use std::thread;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpRequest, HttpResponse, HttpServer};
use qstring::QString;
use rust_bert::pipelines::sentiment::SentimentModel;

async fn index(
    rx: web::Data<crossbeam_channel::Receiver<String>>,
    tx: web::Data<crossbeam_channel::Sender<String>>,
    req: HttpRequest,
) -> HttpResponse {
    let qs = QString::from(req.query_string());
    let text = qs.get("text").unwrap();
    tx.send(text.to_string()).unwrap();
    let body = rx.recv().unwrap();
    HttpResponse::Ok().body(body)
}

async fn server() -> io::Result<()> {
    let port = match env::var("PORT") {
        Ok(val) => val.to_string(),
        Err(_e) => "8080".to_string(),
    };

    let (bert_tx, bert_rx) = unbounded::<String>();
    let (web_tx, web_rx) = unbounded::<String>();

    thread::spawn(move || {
        let sentiment_classifier = match SentimentModel::new(Default::default()) {
            Ok(sc) => sc,
            Err(_e) => return (),
        };
        loop {
            let text = web_rx.recv().unwrap();
            let sentiments = sentiment_classifier.predict(&[&text]);
            let mut results = vec![];
            for sentiment in sentiments {
                let result = format!(
                    "[\"{:?}\", {}]",
                    sentiment.polarity,
                    sentiment.score.to_string()
                );
                results.push(result);
            }
            let body = format!("{{\"result\": [{}]}}", results.join(","),);
            bert_tx.send(body).unwrap();
        }
    });

    let brx = web::Data::new(bert_rx);
    let wtx = web::Data::new(web_tx);
    HttpServer::new(move || {
        App::new()
            .app_data(brx.clone())
            .app_data(wtx.clone())
            .wrap(Cors::new().finish())
            .wrap(middleware::Logger::default())
            .service(web::resource("/").to(index))
    })
    .bind(format!("0.0.0.0:{}", port))?
    .client_timeout(30000)
    .run()
    .await
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    server().await
}
