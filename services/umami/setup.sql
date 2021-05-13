create table if not exists account (
    user_id serial primary key,
    username varchar(255) unique not null,
    password varchar(60) not null,
    is_admin bool not null default false,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp
);

create table if not exists website (
    website_id serial primary key,
    website_uuid uuid unique not null,
    user_id int not null references account(user_id) on delete cascade,
    name varchar(100) not null,
    domain varchar(500),
    share_id varchar(64) unique,
    created_at timestamp with time zone default current_timestamp
);

create table if not exists session (
    session_id serial primary key,
    session_uuid uuid unique not null,
    website_id int not null references website(website_id) on delete cascade,
    created_at timestamp with time zone default current_timestamp,
    hostname varchar(100),
    browser varchar(20),
    os varchar(20),
    device varchar(20),
    screen varchar(11),
    language varchar(35),
    country char(2)
);

create table if not exists pageview (
    view_id serial primary key,
    website_id int not null references website(website_id) on delete cascade,
    session_id int not null references session(session_id) on delete cascade,
    created_at timestamp with time zone default current_timestamp,
    url varchar(500) not null,
    referrer varchar(500)
);

create table if not exists event (
    event_id serial primary key,
    website_id int not null references website(website_id) on delete cascade,
    session_id int not null references session(session_id) on delete cascade,
    created_at timestamp with time zone default current_timestamp,
    url varchar(500) not null,
    event_type varchar(50) not null,
    event_value varchar(50) not null
);

create index if not exists website_user_id_idx on website(user_id);

create index if not exists session_created_at_idx on session(created_at);
create index if not exists session_website_id_idx on session(website_id);

create index if not exists pageview_created_at_idx on pageview(created_at);
create index if not exists pageview_website_id_idx on pageview(website_id);
create index if not exists pageview_session_id_idx on pageview(session_id);
create index if not exists pageview_website_id_created_at_idx on pageview(website_id, created_at);
create index if not exists pageview_website_id_session_id_created_at_idx on pageview(website_id, session_id, created_at);

create index if not exists event_created_at_idx on event(created_at);
create index if not exists event_website_id_idx on event(website_id);
create index if not exists event_session_id_idx on event(session_id);

insert into account (username, password, is_admin) values ('admin', '$2b$10$BUli0c.muyCW1ErNJc3jL.vFRFtFJWrT8/GcR4A.sUdCznaXiqFXa', true)
    on conflict do nothing;
