CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values (
    'Oliver Emberton', 
    'https://oliveremberton.com/2014/the-problem-isnt-that-life-is-unfair-its-your-broken-idea-of-fairness/',
    'The problem isn’t that life is unfair – it’s your broken idea of fairness'
);

insert into blogs (author, url, title) values (
    'Mark Manson',
    'https://markmanson.net/how-to-be-confident',
    'The Only Way to Be Confident'
);