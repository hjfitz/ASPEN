CREATE TYPE patient_gender AS ENUM ('male', 'female', 'other');
CREATE TYPE account_type AS ENUM ('google', 'normal');

CREATE TABLE contact (
	contact_id 	serial 	PRIMARY KEY,
	prefix 		text 	NOT NULL,
	fullname 	text 	NOT NULL,
	given 		text 	NOT NULL,
	phone 		text 	NOT NULL,
	family 		text
);

CREATE TABLE patient (
	patient_id 		serial 			PRIMARY KEY,
	active 			boolean 		NOT NULL,
	fullname 		text 			NOT NULL,
	given 			text 			NOT NULL,
	prefix 			text 			NOT NULL,
	gender 			patient_gender 	NOT NULL,
	last_updated 	timestamptz 	NOT NULL,
	photo_url 		text,
	family 			text,
	contact_id 		serial REFERENCES contact(contact_id) ON DELETE CASCADE
);

CREATE TABLE observation (
	observation_id 	serial 		PRIMARY KEY,
	last_updated 	timestamptz NOT NULL,
	name 			text 	 	NOT NULL,
	value 			text 	 	NOT NULL
);

CREATE TABLE diagnostic_report (
	report_id 				serial 		PRIMARY KEY,
	last_updated 			timestamptz NOT NULL,
	patient_id 				serial 		REFERENCES patient(patient_id) 			ON DELETE CASCADE,
	respiratory_rate 		serial 		REFERENCES observation(observation_id)	ON DELETE CASCADE,
	oxygen_saturation 		serial 		REFERENCES observation(observation_id)	ON DELETE CASCADE,
	supplemental_oxygen 	serial 		REFERENCES observation(observation_id)	ON DELETE CASCADE,
	body_temperature 		serial	 	REFERENCES observation(observation_id)	ON DELETE CASCADE,
	systolic_bp 			serial 		REFERENCES observation(observation_id)	ON DELETE CASCADE,
	heart_rate 				serial 		REFERENCES observation(observation_id)	ON DELETE CASCADE,
	level_of_consciousness 	serial 		REFERENCES observation(observation_id)	ON DELETE CASCADE
);

CREATE TABLE location (
	location_id 	serial 		PRIMARY KEY,
	name		 	text 		UNIQUE NOT NULL,
	last_updated 	timestamptz NOT NULL,
	status		 	text 		NOT NULL,
	description 	text 		NOT NULL,
	type		 	text 		NOT NULL,
);

CREATE TABLE practitioner (
	practitioner_id 	serial 		 PRIMARY KEY,
	name 	 			text 		 NOT NULL,
	added 				timestamptz  NOT NULL,
	username 		 	text 		 UNIQUE NOT NULL,
	account_type 		account_type NOT NULL,
	permissions 		text,
	passhash 			text
);

CREATE TABLE practitionerwards (
	location_id 		serial REFERENCES location(location_id),
	practitioner_id 	serial REFERENCES practitioner(practitioner_id)
);

CREATE TABLE encounter (
	encounter_id 	serial 		PRIMARY KEY,
	last_updated 	timestamptz NOT NULL,
	class 			text 		NOT NULL,
	status 			text 		NOT NULL,
	patient_id 		serial 		REFERENCES patient(patient_id) ON DELETE CASCADE,
	location_id 	serial 		REFERENCES location(location_id)
);

INSERT INTO location (
	name, 
	last_updated, 
	status, 
	description, 
	type
) VALUES (
	"Ward 99", 
	"2019-02-17 14:25:25-07"
	"active",
	"The first ward added",
	"Ward"
);
