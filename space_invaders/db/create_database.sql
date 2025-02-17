BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Events" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"frame_id"	INTEGER,
	"killer"	TEXT,
	"killed"	TEXT,
	FOREIGN KEY("frame_id") REFERENCES "Frames"("id")
);
CREATE TABLE IF NOT EXISTS "Games" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"player_id"	TEXT,
	"date"	TEXT,
	"mode"	INTEGER
);
CREATE TABLE IF NOT EXISTS "Frames" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"game_id"	INTEGER NOT NULL,
	"timestamp" TEXT,
	"frame_number"	INTEGER,
	"player1_position"	INTEGER,
	"player2_position" INTEGER,
	"player1_lives"	INTEGER,
	"player2_lives" INTEGER,
	"player1_score"	INTEGER,
	"player2_score" INTEGER,
	"ai_position"	INTEGER,
	"ai_lives"	INTEGER,
	"ai_score"	INTEGER,
	"frame_sent" INTEGER,
	FOREIGN KEY("game_id") REFERENCES "Games"("id")
);
CREATE TABLE IF NOT EXISTS "Bullets" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"frame_id"	INTEGER NOT NULL,
	"type"	INTEGER,
	"x"	INTEGER,
	"y"	INTEGER,
	FOREIGN KEY("frame_id") REFERENCES "Frames"("id")
);
CREATE TABLE IF NOT EXISTS "Enemies" (
	"id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"frame_id"	INTEGER NOT NULL,
	"side"	TEXT,
	"x"	INTEGER,
	"y"	INTEGER,
	FOREIGN KEY("frame_id") REFERENCES "Frames"("id")
);
CREATE TABLE IF NOT EXISTS "Actions" (
	"game_id" INTEGER NOT NULL,
	"frame_id" INTEGER NOT NULL,
	"frame_sent" INTEGER,
	"player_left" INTEGER,
	"player_right" INTEGER,
	"player_shoot" INTEGER,
	"player_tried" INTEGER,
	"player_signal_down" INTEGER,
	"player_signal_up" INTEGER,
	"player_tried_down" INTEGER,
	"player_tried_up" INTEGER,
	"ai_actual_left" INTEGER,
	"ai_actual_right" INTEGER,
	"ai_actual_shoot" INTEGER,
	"ai_rec_left" INTEGER,
	"ai_rec_right" INTEGER,
	"ai_rec_shoot" INTEGER,

	FOREIGN KEY("game_id") REFERENCES "Games"("id"),
	FOREIGN KEY("frame_id") REFERENCES "Frames"("id")
);
COMMIT;
