ALTER TABLE permit ADD COLUMN deleted_ind BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE mine_incident ADD COLUMN deleted_ind BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE variance ADD COLUMN deleted_ind BOOLEAN DEFAULT false NOT NULL;
