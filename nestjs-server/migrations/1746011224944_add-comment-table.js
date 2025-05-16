exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE comments (
          id SERIAL PRIMARY KEY,
      media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
      comment_text TEXT NOT NULL,
      author_name TEXT NOT NULL,
      parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);
};

exports.down = (pgm) => {
  pgm.sql('DROP TABLE comments');
};
