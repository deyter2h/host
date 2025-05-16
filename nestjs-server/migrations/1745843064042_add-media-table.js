exports.up = (pgm) => {
  pgm.sql(`
      CREATE TABLE media (
        id   SERIAL PRIMARY KEY,
        name TEXT   NOT NULL,
        type VARCHAR(10) NOT NULL
                   CHECK (type IN ('image','video')),
        author_name TEXT   NOT NULL,
        url TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
};

exports.down = (pgm) => {
  pgm.sql('DROP TABLE media');
};
