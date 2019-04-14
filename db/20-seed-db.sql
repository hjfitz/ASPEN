-- one ward
INSERT INTO location (name, last_updated, status, description, type) VALUES ('Ward 1', 'Sat Feb 23 2019 13:27:53 GMT+0000', 'active', 'Testing area', 'Ward');

-- two contacts and their patients
INSERT INTO contact (contact_id, prefix, fullname, given, phone, family) VALUES (1, 'Mr', 'George Keith Brian Fitzgerald', 'George', '07585000211', 'Fitzgerald');
INSERT INTO contact (contact_id, prefix, fullname, given, phone, family) VALUES (2, 'Miss', 'Chloe Bryson', 'Chloe', '07483910234', ' Bryson');
-- two patients
INSERT INTO patient (patient_id, active, fullname, given, prefix, gender, last_updated, family, contact_id) VALUES (1, true, 'Harry Fitzgerald', 'Harry', 'Mr', 'male', 'Sat Feb 23 2019 21:21:47 GMT+0000', 'Fitzgerald', 2);
INSERT INTO patient (patient_id, active, fullname, given, prefix, gender, last_updated, family, contact_id) VALUES (2, true, 'James Fitzgerald', 'James', 'Mr', 'male', 'Sat Feb 22 2019 21:21:47 GMT+0000', 'Fitzgerald', 2);

-- encounters for each patient to put in to a ward
INSERT INTO encounter (last_updated, class, status, patient_id, location_id) VALUES ('Sat Feb 23 2019 21:21:47 GMT+0000', 'admission', 'finished', 1, 1);
INSERT INTO encounter (last_updated, class, status, patient_id, location_id) VALUES ('Sat Feb 22 2019 21:21:47 GMT+0000', 'admission', 'finished', 2, 1);


-- two observations per patient

-- readings for harry
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (1, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'respiratory_rate', 13);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (2, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'oxygen_saturation', 100);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (3, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'supplemental_oxygen', 'off');
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (4, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'body_temperature', 37.1);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (5, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'systolic_bp', 120);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (6, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'heart_rate', 60);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (7, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'level_of_consciousness', 'A');

INSERT INTO observation (observation_id, last_updated, name, value) VALUES (8, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'respiratory_rate', 14);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (9, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'oxygen_saturation', 101);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (10, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'supplemental_oxygen', 'off');
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (11, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'body_temperature', 37.2);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (12, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'systolic_bp', 121);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (13, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'heart_rate', 63);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (14, 'Sat Feb 23 2019 21:21:47 GMT+0000', 'level_of_consciousness', 'A');

INSERT INTO diagnostic_report (last_updated, patient_id, respiratory_rate, oxygen_saturation, supplemental_oxygen, body_temperature, systolic_bp, heart_rate, level_of_consciousness) VALUES ('Sat Feb 23 2019 21:21:47 GMT+0000', 1, 1, 2, 3, 4, 5, 6, 7);
INSERT INTO diagnostic_report (last_updated, patient_id, respiratory_rate, oxygen_saturation, supplemental_oxygen, body_temperature, systolic_bp, heart_rate, level_of_consciousness) VALUES ('Sat Feb 23 2019 21:21:47 GMT+0000', 1, 8, 9, 10, 11, 12, 13, 14);

-- readings for james
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (15, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'respiratory_rate', 13);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (16, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'oxygen_saturation', 100);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (17, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'supplemental_oxygen', 'off');
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (18, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'body_temperature', 37.1);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (19, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'systolic_bp', 120);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (20, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'heart_rate', 60);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (21, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'level_of_consciousness', 'A');

INSERT INTO observation (observation_id, last_updated, name, value) VALUES (22, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'respiratory_rate', 17);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (23, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'oxygen_saturation', 101);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (24, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'supplemental_oxygen', 'off');
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (25, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'body_temperature', 37.2);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (26, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'systolic_bp', 110);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (27, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'heart_rate', 69);
INSERT INTO observation (observation_id, last_updated, name, value) VALUES (28, 'Sat Feb 22 2019 21:21:47 GMT+0000', 'level_of_consciousness', 'A');

INSERT INTO diagnostic_report (last_updated, patient_id, respiratory_rate, oxygen_saturation, supplemental_oxygen, body_temperature, systolic_bp, heart_rate, level_of_consciousness) VALUES ('Sat Feb 23 2019 21:21:47 GMT+0000', 2, 15, 16, 17, 18, 19, 20, 21);
INSERT INTO diagnostic_report (last_updated, patient_id, respiratory_rate, oxygen_saturation, supplemental_oxygen, body_temperature, systolic_bp, heart_rate, level_of_consciousness) VALUES ('Sat Feb 23 2019 21:21:47 GMT+0000', 2, 22, 23, 24, 25, 26, 27, 28);
