-- Active: 1675449217751@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT "user" NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);
CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);
CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER DEFAULT (0) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);
INSERT INTO users (id, name, email, password) 
VALUES(
        "user01",
        "albert einstein",
        "a-e@email.com",
        "S3nha1"
    ),
    (
        "user02",
        "isaac newton",
        "i-n@email.com",
        "S3nha2"
    ),
    (
        "user03",
        "marie curie",
        "m-c3@email.com",
        "S3nha3"
    ),
    ("user04", "hipatia", "h@email.com", "S3nha4"),
    (
        "user05",
        "nikola tesla",
        "n-t@email.com",
        "S3nha5"
    );

    SELECT * FROM users;

    DROP TABLE posts;

    INSERT INTO posts (id,creator_id, content)
    VALUES("post01","user03","radio e polonio"),
    ("post02","user03","a corrente alternada");

     SELECT * FROM posts;
    