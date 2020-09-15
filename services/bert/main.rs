use std::io;

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpRequest, HttpResponse, HttpServer};
use qstring::QString;
use rust_bert::pipelines::sentiment::SentimentModel;

async fn index(req: HttpRequest) -> HttpResponse {
    let qs = QString::from(req.query_string());
    let text = qs.get("text").unwrap();

    let sentiments = match analyze_sentiments(text.to_string()) {
        Ok(s) => s,
        Err(e) => return HttpResponse::InternalServerError().body(format!("{:?}", e)),
    };

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
    HttpResponse::Ok().body(body)
}

async fn server() -> io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::new().finish())
            .wrap(middleware::Logger::default())
            .service(web::resource("/").to(index))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}

fn analyze_sentiments(
    text: String,
) -> anyhow::Result<Vec<rust_bert::pipelines::sentiment::Sentiment>> {
    let sentiment_classifier = SentimentModel::new(Default::default())?;
    Ok(sentiment_classifier.predict(&[&text]))
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    server().await
}
