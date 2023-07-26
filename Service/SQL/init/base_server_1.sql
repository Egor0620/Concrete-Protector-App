/*
 Navicat PostgreSQL Data Transfer

 Source Server         : dbreader
 Source Server Version : 90400
 Source Host           : localhost
 Source Database       : concrete
 Source Schema         : public

 Target Server Version : 90400
 File Encoding         : utf-8

 Date: 01/19/2015 22:54:02 PM
*/

-- ----------------------------
--  Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS "account";
CREATE TABLE "account" (
	"id" uuid NOT NULL,
	"username" varchar(100) NOT NULL COLLATE "default",
	"password" varchar(100) NOT NULL COLLATE "default",
	"passwordtype" int8 NOT NULL DEFAULT 0,
	"version" int8 NOT NULL DEFAULT 0,
	"status" int8 NOT NULL DEFAULT 1,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" varchar NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "account" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for accountrole
-- ----------------------------
DROP TABLE IF EXISTS "accountrole";
CREATE TABLE "accountrole" (
	"id" uuid NOT NULL,
	"accountid" uuid NOT NULL,
	"role" varchar(64) NOT NULL DEFAULT 'user'::character varying COLLATE "default",
	"version" int8 NOT NULL DEFAULT 0,
	"status" int8 NOT NULL DEFAULT 1,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" varchar NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "accountrole" OWNER TO "dbreader";

-- ----------------------------
--  Records of accountrole
-- ----------------------------
BEGIN;
INSERT INTO "accountrole" VALUES ('cd520088-1404-4168-8a8c-f5f02ac107c5', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', 'user', '0', '1', '2014-12-16 20:50:23-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-16 20:50:48-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "accountrole" VALUES ('31a697c9-e0b7-444a-9538-68df19607214', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', 'subscriber', '0', '1', '2014-12-16 20:53:13-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-16 20:53:21-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "accountrole" VALUES ('4988c1c0-eb11-4d70-9dfd-788aaf9c8dc5', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', 'concreteprotector', '0', '1', '2014-12-17 12:15:45-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-17 12:15:52-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "accountrole" VALUES ('8a27b900-68b3-4e29-81ce-d31eac9cd399', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', 'administrator', '0', '1', '2014-12-16 20:52:13-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-16 20:52:21-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
COMMIT;

-- ----------------------------
--  Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS "address";
CREATE TABLE "address" (
	"id" uuid NOT NULL,
	"personid" uuid NOT NULL,
	"address1" varchar(100) DEFAULT ''::character varying COLLATE "default",
	"address2" varchar(100) DEFAULT ''::character varying COLLATE "default",
	"city" varchar(100) DEFAULT ''::character varying COLLATE "default",
	"state" varchar(10) DEFAULT ''::character varying COLLATE "default",
	"zip" varchar(10) DEFAULT ''::character varying COLLATE "default",
	"type" varchar(20) NOT NULL COLLATE "default",
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"primary" bool NOT NULL DEFAULT false
)
WITH (OIDS=FALSE);
ALTER TABLE "address" OWNER TO "dbreader";


-- ----------------------------
--  Table structure for addresstype
-- ----------------------------
DROP TABLE IF EXISTS "addresstype";
CREATE TABLE "addresstype" (
	"addresstype" varchar(10) NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "addresstype" OWNER TO "dbreader";

-- ----------------------------
--  Records of addresstype
-- ----------------------------
BEGIN;
INSERT INTO "addresstype" VALUES ('home');
INSERT INTO "addresstype" VALUES ('office');
INSERT INTO "addresstype" VALUES ('billing');
INSERT INTO "addresstype" VALUES ('main');
COMMIT;

-- ----------------------------
--  Table structure for color
-- ----------------------------
DROP TABLE IF EXISTS "color";
CREATE TABLE "color" (
	"id" uuid NOT NULL,
	"name" varchar(100) NOT NULL COLLATE "default",
	"version" int8 NOT NULL DEFAULT 0,
	"status" int8 NOT NULL DEFAULT 1,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" varchar NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "color" OWNER TO "dbreader";

-- ----------------------------
--  Records of color
-- ----------------------------
BEGIN;
INSERT INTO "color" VALUES ('e4906e3b-5e8a-4b46-a7a3-1c093454d06b', 'green', '0', '1', '2014-09-05 14:57:55.988-05', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-09-05 14:57:55.689-05', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('f5d61131-8480-48e0-b730-62e6c83b3c49', 'blue', '0', '1', '2014-09-05 14:57:55.988-05', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-09-05 14:57:55.689-05', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('92727ea5-d8a0-440c-8116-99a96cf10830', 'orange', '0', '1', '2014-12-22 07:45:12.536-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-22 07:45:12.456-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('f9a3b40d-e615-4748-978c-6dd1109c4157', 'pink', '0', '1', '2014-12-22 07:46:44.487-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-22 07:46:44.394-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('8f97ccaa-849d-4eba-8591-6c09048344d0', 'silver', '1', '1', '2014-12-22 07:41:32.167-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-22 07:49:19.944-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('ff1f409b-f0bd-4dae-96ef-d8c53531acb4', 'yellow', '1', '1', '2014-12-22 07:47:27.875-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-22 07:49:32.088-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('762e2ed6-4797-4ee9-a66e-0a3b6b62d097', 'gold', '1', '1', '2014-12-22 07:42:18.837-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-22 07:49:44.509-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('3d029a3f-177f-4113-bb37-e9310c8a4421', 'white', '1', '1', '2014-12-22 07:39:57.369-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-22 07:49:54.535-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('5a269fd0-02bc-4dae-bb5d-4ebaa5155241', 'black', '0', '1', '2014-12-22 07:54:56.356-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2014-12-22 07:54:56.295-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('bdcaae4f-30d5-4ebd-a7a2-4deefc4fbb60', 'red', '2', '1', '2014-09-05 14:57:55.988-05', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2015-01-06 11:58:14.257-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
INSERT INTO "color" VALUES ('d8e7b441-1223-4e20-871e-8a5f72389b7e', 'light blue', '1', '1', '2015-01-12 20:08:33.353-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802', '2015-01-12 20:08:52.981-06', '18e5ac49-0e0d-47b6-a3ad-2842a6168802');
COMMIT;

-- ----------------------------
--  Table structure for countries
-- ----------------------------
DROP TABLE IF EXISTS "countries";
CREATE TABLE "countries" (
	"id" varchar(10) NOT NULL COLLATE "default",
	"country" varchar(100) NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "countries" OWNER TO "dbreader";

-- ----------------------------
--  Records of countries
-- ----------------------------
BEGIN;
INSERT INTO "countries" VALUES ('AF', 'Afghanistan');
INSERT INTO "countries" VALUES ('AX', 'Åland Islands');
INSERT INTO "countries" VALUES ('AL', 'Albania');
INSERT INTO "countries" VALUES ('DZ', 'Algeria');
INSERT INTO "countries" VALUES ('AS', 'American Samoa');
INSERT INTO "countries" VALUES ('AD', 'Andorra');
INSERT INTO "countries" VALUES ('AO', 'Angola');
INSERT INTO "countries" VALUES ('AI', 'Anguilla');
INSERT INTO "countries" VALUES ('AQ', 'Antarctica');
INSERT INTO "countries" VALUES ('AG', 'Antigua and Barbuda');
INSERT INTO "countries" VALUES ('AR', 'Argentina');
INSERT INTO "countries" VALUES ('AM', 'Armenia');
INSERT INTO "countries" VALUES ('AW', 'Aruba');
INSERT INTO "countries" VALUES ('AU', 'Australia');
INSERT INTO "countries" VALUES ('AT', 'Austria');
INSERT INTO "countries" VALUES ('AZ', 'Azerbaijan');
INSERT INTO "countries" VALUES ('BS', 'Bahamas');
INSERT INTO "countries" VALUES ('BH', 'Bahrain');
INSERT INTO "countries" VALUES ('BD', 'Bangladesh');
INSERT INTO "countries" VALUES ('BB', 'Barbados');
INSERT INTO "countries" VALUES ('BY', 'Belarus');
INSERT INTO "countries" VALUES ('BE', 'Belgium');
INSERT INTO "countries" VALUES ('BZ', 'Belize');
INSERT INTO "countries" VALUES ('BJ', 'Benin');
INSERT INTO "countries" VALUES ('BM', 'Bermuda');
INSERT INTO "countries" VALUES ('BT', 'Bhutan');
INSERT INTO "countries" VALUES ('BO', 'Bolivia, Plurinational State of');
INSERT INTO "countries" VALUES ('BQ', 'Bonaire, Sint Eustatius and Saba');
INSERT INTO "countries" VALUES ('BA', 'Bosnia and Herzegovina');
INSERT INTO "countries" VALUES ('BW', 'Botswana');
INSERT INTO "countries" VALUES ('BV', 'Bouvet Island');
INSERT INTO "countries" VALUES ('BR', 'Brazil');
INSERT INTO "countries" VALUES ('IO', 'British Indian Ocean Territory');
INSERT INTO "countries" VALUES ('BN', 'Brunei Darussalam');
INSERT INTO "countries" VALUES ('BG', 'Bulgaria');
INSERT INTO "countries" VALUES ('BF', 'Burkina Faso');
INSERT INTO "countries" VALUES ('BI', 'Burundi');
INSERT INTO "countries" VALUES ('KH', 'Cambodia');
INSERT INTO "countries" VALUES ('CM', 'Cameroon');
INSERT INTO "countries" VALUES ('CA', 'Canada');
INSERT INTO "countries" VALUES ('CV', 'Cape Verde');
INSERT INTO "countries" VALUES ('KY', 'Cayman Islands');
INSERT INTO "countries" VALUES ('CF', 'Central African Republic');
INSERT INTO "countries" VALUES ('TD', 'Chad');
INSERT INTO "countries" VALUES ('CL', 'Chile');
INSERT INTO "countries" VALUES ('CN', 'China');
INSERT INTO "countries" VALUES ('CX', 'Christmas Island');
INSERT INTO "countries" VALUES ('CC', 'Cocos (Keeling) Islands');
INSERT INTO "countries" VALUES ('CO', 'Colombia');
INSERT INTO "countries" VALUES ('KM', 'Comoros');
INSERT INTO "countries" VALUES ('CG', 'Congo');
INSERT INTO "countries" VALUES ('CD', 'Congo, the Democratic Republic of the');
INSERT INTO "countries" VALUES ('CK', 'Cook Islands');
INSERT INTO "countries" VALUES ('CR', 'Costa Rica');
INSERT INTO "countries" VALUES ('CI', 'Côte d''Ivoire');
INSERT INTO "countries" VALUES ('HR', 'Croatia');
INSERT INTO "countries" VALUES ('CU', 'Cuba');
INSERT INTO "countries" VALUES ('CW', 'Curaçao');
INSERT INTO "countries" VALUES ('CY', 'Cyprus');
INSERT INTO "countries" VALUES ('CZ', 'Czech Republic');
INSERT INTO "countries" VALUES ('DK', 'Denmark');
INSERT INTO "countries" VALUES ('DJ', 'Djibouti');
INSERT INTO "countries" VALUES ('DM', 'Dominica');
INSERT INTO "countries" VALUES ('DO', 'Dominican Republic');
INSERT INTO "countries" VALUES ('EC', 'Ecuador');
INSERT INTO "countries" VALUES ('EG', 'Egypt');
INSERT INTO "countries" VALUES ('SV', 'El Salvador');
INSERT INTO "countries" VALUES ('GQ', 'Equatorial Guinea');
INSERT INTO "countries" VALUES ('ER', 'Eritrea');
INSERT INTO "countries" VALUES ('EE', 'Estonia');
INSERT INTO "countries" VALUES ('ET', 'Ethiopia');
INSERT INTO "countries" VALUES ('FK', 'Falkland Islands (Malvinas)');
INSERT INTO "countries" VALUES ('FO', 'Faroe Islands');
INSERT INTO "countries" VALUES ('FJ', 'Fiji');
INSERT INTO "countries" VALUES ('FI', 'Finland');
INSERT INTO "countries" VALUES ('FR', 'France');
INSERT INTO "countries" VALUES ('GF', 'French Guiana');
INSERT INTO "countries" VALUES ('PF', 'French Polynesia');
INSERT INTO "countries" VALUES ('TF', 'French Southern Territories');
INSERT INTO "countries" VALUES ('GA', 'Gabon');
INSERT INTO "countries" VALUES ('GM', 'Gambia');
INSERT INTO "countries" VALUES ('GE', 'Georgia');
INSERT INTO "countries" VALUES ('DE', 'Germany');
INSERT INTO "countries" VALUES ('GH', 'Ghana');
INSERT INTO "countries" VALUES ('GI', 'Gibraltar');
INSERT INTO "countries" VALUES ('GR', 'Greece');
INSERT INTO "countries" VALUES ('GL', 'Greenland');
INSERT INTO "countries" VALUES ('GD', 'Grenada');
INSERT INTO "countries" VALUES ('GP', 'Guadeloupe');
INSERT INTO "countries" VALUES ('GU', 'Guam');
INSERT INTO "countries" VALUES ('GT', 'Guatemala');
INSERT INTO "countries" VALUES ('GG', 'Guernsey');
INSERT INTO "countries" VALUES ('GN', 'Guinea');
INSERT INTO "countries" VALUES ('GW', 'Guinea-Bissau');
INSERT INTO "countries" VALUES ('GY', 'Guyana');
INSERT INTO "countries" VALUES ('HT', 'Haiti');
INSERT INTO "countries" VALUES ('HM', 'Heard Island and McDonald Islands');
INSERT INTO "countries" VALUES ('VA', 'Holy See (Vatican City State)');
INSERT INTO "countries" VALUES ('HN', 'Honduras');
INSERT INTO "countries" VALUES ('HK', 'Hong Kong');
INSERT INTO "countries" VALUES ('HU', 'Hungary');
INSERT INTO "countries" VALUES ('IS', 'Iceland');
INSERT INTO "countries" VALUES ('IN', 'India');
INSERT INTO "countries" VALUES ('ID', 'Indonesia');
INSERT INTO "countries" VALUES ('IR', 'Iran, Islamic Republic of');
INSERT INTO "countries" VALUES ('IQ', 'Iraq');
INSERT INTO "countries" VALUES ('IE', 'Ireland');
INSERT INTO "countries" VALUES ('IM', 'Isle of Man');
INSERT INTO "countries" VALUES ('IL', 'Israel');
INSERT INTO "countries" VALUES ('IT', 'Italy');
INSERT INTO "countries" VALUES ('JM', 'Jamaica');
INSERT INTO "countries" VALUES ('JP', 'Japan');
INSERT INTO "countries" VALUES ('JE', 'Jersey');
INSERT INTO "countries" VALUES ('JO', 'Jordan');
INSERT INTO "countries" VALUES ('KZ', 'Kazakhstan');
INSERT INTO "countries" VALUES ('KE', 'Kenya');
INSERT INTO "countries" VALUES ('KI', 'Kiribati');
INSERT INTO "countries" VALUES ('KP', 'Korea, Democratic Peoples Republic of');
INSERT INTO "countries" VALUES ('KR', 'Korea, Republic of');
INSERT INTO "countries" VALUES ('KW', 'Kuwait');
INSERT INTO "countries" VALUES ('KG', 'Kyrgyzstan');
INSERT INTO "countries" VALUES ('LA', 'Lao Peoples Democratic Republic');
INSERT INTO "countries" VALUES ('LV', 'Latvia');
INSERT INTO "countries" VALUES ('LB', 'Lebanon');
INSERT INTO "countries" VALUES ('LS', 'Lesotho');
INSERT INTO "countries" VALUES ('LR', 'Liberia');
INSERT INTO "countries" VALUES ('LY', 'Libya');
INSERT INTO "countries" VALUES ('LI', 'Liechtenstein');
INSERT INTO "countries" VALUES ('LT', 'Lithuania');
INSERT INTO "countries" VALUES ('LU', 'Luxembourg');
INSERT INTO "countries" VALUES ('MO', 'Macao');
INSERT INTO "countries" VALUES ('MK', 'Macedonia, the former Yugoslav Republic of');
INSERT INTO "countries" VALUES ('MG', 'Madagascar');
INSERT INTO "countries" VALUES ('MW', 'Malawi');
INSERT INTO "countries" VALUES ('MY', 'Malaysia');
INSERT INTO "countries" VALUES ('MV', 'Maldives');
INSERT INTO "countries" VALUES ('ML', 'Mali');
INSERT INTO "countries" VALUES ('MT', 'Malta');
INSERT INTO "countries" VALUES ('MH', 'Marshall Islands');
INSERT INTO "countries" VALUES ('MQ', 'Martinique');
INSERT INTO "countries" VALUES ('MR', 'Mauritania');
INSERT INTO "countries" VALUES ('MU', 'Mauritius');
INSERT INTO "countries" VALUES ('YT', 'Mayotte');
INSERT INTO "countries" VALUES ('MX', 'Mexico');
INSERT INTO "countries" VALUES ('FM', 'Micronesia, Federated States of');
INSERT INTO "countries" VALUES ('MD', 'Moldova, Republic of');
INSERT INTO "countries" VALUES ('MC', 'Monaco');
INSERT INTO "countries" VALUES ('MN', 'Mongolia');
INSERT INTO "countries" VALUES ('ME', 'Montenegro');
INSERT INTO "countries" VALUES ('MS', 'Montserrat');
INSERT INTO "countries" VALUES ('MA', 'Morocco');
INSERT INTO "countries" VALUES ('MZ', 'Mozambique');
INSERT INTO "countries" VALUES ('MM', 'Myanmar');
INSERT INTO "countries" VALUES ('NA', 'Namibia');
INSERT INTO "countries" VALUES ('NR', 'Nauru');
INSERT INTO "countries" VALUES ('NP', 'Nepal');
INSERT INTO "countries" VALUES ('NL', 'Netherlands');
INSERT INTO "countries" VALUES ('NC', 'New Caledonia');
INSERT INTO "countries" VALUES ('NZ', 'New Zealand');
INSERT INTO "countries" VALUES ('NI', 'Nicaragua');
INSERT INTO "countries" VALUES ('NE', 'Niger');
INSERT INTO "countries" VALUES ('NG', 'Nigeria');
INSERT INTO "countries" VALUES ('NU', 'Niue');
INSERT INTO "countries" VALUES ('NF', 'Norfolk Island');
INSERT INTO "countries" VALUES ('MP', 'Northern Mariana Islands');
INSERT INTO "countries" VALUES ('NO', 'Norway');
INSERT INTO "countries" VALUES ('OM', 'Oman');
INSERT INTO "countries" VALUES ('PK', 'Pakistan');
INSERT INTO "countries" VALUES ('PW', 'Palau');
INSERT INTO "countries" VALUES ('PS', 'Palestinian Territory, Occupied');
INSERT INTO "countries" VALUES ('PA', 'Panama');
INSERT INTO "countries" VALUES ('PG', 'Papua New Guinea');
INSERT INTO "countries" VALUES ('PY', 'Paraguay');
INSERT INTO "countries" VALUES ('PE', 'Peru');
INSERT INTO "countries" VALUES ('PH', 'Philippines');
INSERT INTO "countries" VALUES ('PN', 'Pitcairn');
INSERT INTO "countries" VALUES ('PL', 'Poland');
INSERT INTO "countries" VALUES ('PT', 'Portugal');
INSERT INTO "countries" VALUES ('PR', 'Puerto Rico');
INSERT INTO "countries" VALUES ('QA', 'Qatar');
INSERT INTO "countries" VALUES ('RE', 'Réunion');
INSERT INTO "countries" VALUES ('RO', 'Romania');
INSERT INTO "countries" VALUES ('RU', 'Russian Federation');
INSERT INTO "countries" VALUES ('RW', 'Rwanda');
INSERT INTO "countries" VALUES ('BL', 'Saint Barthélemy');
INSERT INTO "countries" VALUES ('SH', 'Saint Helena, Ascension and Tristan da Cunha');
INSERT INTO "countries" VALUES ('KN', 'Saint Kitts and Nevis');
INSERT INTO "countries" VALUES ('LC', 'Saint Lucia');
INSERT INTO "countries" VALUES ('MF', 'Saint Martin (French part)');
INSERT INTO "countries" VALUES ('PM', 'Saint Pierre and Miquelon');
INSERT INTO "countries" VALUES ('VC', 'Saint Vincent and the Grenadines');
INSERT INTO "countries" VALUES ('WS', 'Samoa');
INSERT INTO "countries" VALUES ('SM', 'San Marino');
INSERT INTO "countries" VALUES ('ST', 'Sao Tome and Principe');
INSERT INTO "countries" VALUES ('SA', 'Saudi Arabia');
INSERT INTO "countries" VALUES ('SN', 'Senegal');
INSERT INTO "countries" VALUES ('RS', 'Serbia');
INSERT INTO "countries" VALUES ('SC', 'Seychelles');
INSERT INTO "countries" VALUES ('SL', 'Sierra Leone');
INSERT INTO "countries" VALUES ('SG', 'Singapore');
INSERT INTO "countries" VALUES ('SX', 'Sint Maarten (Dutch part)');
INSERT INTO "countries" VALUES ('SK', 'Slovakia');
INSERT INTO "countries" VALUES ('SI', 'Slovenia');
INSERT INTO "countries" VALUES ('SB', 'Solomon Islands');
INSERT INTO "countries" VALUES ('SO', 'Somalia');
INSERT INTO "countries" VALUES ('ZA', 'South Africa');
INSERT INTO "countries" VALUES ('GS', 'South Georgia and the South Sandwich Islands');
INSERT INTO "countries" VALUES ('SS', 'South Sudan');
INSERT INTO "countries" VALUES ('ES', 'Spain');
INSERT INTO "countries" VALUES ('LK', 'Sri Lanka');
INSERT INTO "countries" VALUES ('SD', 'Sudan');
INSERT INTO "countries" VALUES ('SR', 'Suriname');
INSERT INTO "countries" VALUES ('SJ', 'Svalbard and Jan Mayen');
INSERT INTO "countries" VALUES ('SZ', 'Swaziland');
INSERT INTO "countries" VALUES ('SE', 'Sweden');
INSERT INTO "countries" VALUES ('CH', 'Switzerland');
INSERT INTO "countries" VALUES ('SY', 'Syrian Arab Republic');
INSERT INTO "countries" VALUES ('TW', 'Taiwan, Province of China');
INSERT INTO "countries" VALUES ('TJ', 'Tajikistan');
INSERT INTO "countries" VALUES ('TZ', 'Tanzania, United Republic of');
INSERT INTO "countries" VALUES ('TH', 'Thailand');
INSERT INTO "countries" VALUES ('TL', 'Timor-Leste');
INSERT INTO "countries" VALUES ('TG', 'Togo');
INSERT INTO "countries" VALUES ('TK', 'Tokelau');
INSERT INTO "countries" VALUES ('TO', 'Tonga');
INSERT INTO "countries" VALUES ('TT', 'Trinidad and Tobago');
INSERT INTO "countries" VALUES ('TN', 'Tunisia');
INSERT INTO "countries" VALUES ('TR', 'Turkey');
INSERT INTO "countries" VALUES ('TM', 'Turkmenistan');
INSERT INTO "countries" VALUES ('TC', 'Turks and Caicos Islands');
INSERT INTO "countries" VALUES ('TV', 'Tuvalu');
INSERT INTO "countries" VALUES ('UG', 'Uganda');
INSERT INTO "countries" VALUES ('UA', 'Ukraine');
INSERT INTO "countries" VALUES ('AE', 'United Arab Emirates');
INSERT INTO "countries" VALUES ('GB', 'United Kingdom');
INSERT INTO "countries" VALUES ('US', 'United States');
INSERT INTO "countries" VALUES ('UM', 'United States Minor Outlying Islands');
INSERT INTO "countries" VALUES ('UY', 'Uruguay');
INSERT INTO "countries" VALUES ('UZ', 'Uzbekistan');
INSERT INTO "countries" VALUES ('VU', 'Vanuatu');
INSERT INTO "countries" VALUES ('VE', 'Venezuela, Bolivarian Republic of');
INSERT INTO "countries" VALUES ('VN', 'Viet Nam');
INSERT INTO "countries" VALUES ('VG', 'Virgin Islands, British');
INSERT INTO "countries" VALUES ('VI', 'Virgin Islands, U.S.');
INSERT INTO "countries" VALUES ('WF', 'Wallis and Futuna');
INSERT INTO "countries" VALUES ('EH', 'Western Sahara');
INSERT INTO "countries" VALUES ('YE', 'Yemen');
INSERT INTO "countries" VALUES ('ZM', 'Zambia');
INSERT INTO "countries" VALUES ('ZW', 'Zimbabwe');
COMMIT;

-- ----------------------------
--  Table structure for ingredient
-- ----------------------------
DROP TABLE IF EXISTS "ingredient";
CREATE TABLE "ingredient" (
	"id" uuid NOT NULL,
	"name" varchar(500) NOT NULL COLLATE "default",
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"coverage" int8 NOT NULL DEFAULT 0,
	"purchaseprice" numeric NOT NULL DEFAULT 0
)
WITH (OIDS=FALSE);
ALTER TABLE "ingredient" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for ingredientcolor
-- ----------------------------
DROP TABLE IF EXISTS "ingredientcolor";
CREATE TABLE "ingredientcolor" (
	"id" uuid NOT NULL,
	"ingredientid" uuid NOT NULL,
	"colorid" uuid NOT NULL,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "ingredientcolor" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for ingredientpattern
-- ----------------------------
DROP TABLE IF EXISTS "ingredientpattern";
CREATE TABLE "ingredientpattern" (
	"id" uuid NOT NULL,
	"ingredientid" uuid NOT NULL,
	"patternid" uuid NOT NULL,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "ingredientpattern" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for lead
-- ----------------------------
DROP TABLE IF EXISTS "lead";
CREATE TABLE "lead" (
	"id" uuid NOT NULL,
	"personid" uuid NOT NULL,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "lead" OWNER TO "dbreader";

COMMENT ON COLUMN "lead"."personid" IS 'PersonId - points to the person as a lead';

-- ----------------------------
--  Table structure for leaddetail
-- ----------------------------
DROP TABLE IF EXISTS "leaddetail";
CREATE TABLE "leaddetail" (
	"id" uuid NOT NULL,
	"leadid" uuid NOT NULL,
	"email" varchar(100) COLLATE "default",
	"besttimetocall" varchar(100) COLLATE "default",
	"hearaboutus" text COLLATE "default",
	"howcanwehelp" text COLLATE "default",
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "leaddetail" OWNER TO "dbreader";

COMMENT ON COLUMN "leaddetail"."leadid" IS 'This is the id from the person table as a lead is a type of person ';

-- ----------------------------
--  Table structure for note
-- ----------------------------
DROP TABLE IF EXISTS "note";
CREATE TABLE "note" (
	"id" uuid NOT NULL,
	"fid" uuid NOT NULL,
	"body" varchar(500) DEFAULT ''::character varying COLLATE "default",
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "note" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for pattern
-- ----------------------------
DROP TABLE IF EXISTS "pattern";
CREATE TABLE "pattern" (
	"id" uuid NOT NULL,
	"name" varchar(100) NOT NULL COLLATE "default",
	"version" int8 NOT NULL DEFAULT 0,
	"status" int8 NOT NULL DEFAULT 1,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" varchar NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "pattern" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for person
-- ----------------------------
DROP TABLE IF EXISTS "person";
CREATE TABLE "person" (
	"id" uuid NOT NULL,
	"firstname" varchar(100) DEFAULT ''::character varying COLLATE "default",
	"lastname" varchar(100) DEFAULT ''::character varying COLLATE "default",
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"company" varchar(250) DEFAULT ''::character varying COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "person" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for phone
-- ----------------------------
DROP TABLE IF EXISTS "phone";
CREATE TABLE "phone" (
	"id" uuid NOT NULL,
	"personid" uuid NOT NULL,
	"number" varchar(20) NOT NULL COLLATE "default",
	"type" varchar(20) NOT NULL COLLATE "default",
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"primary" bool NOT NULL DEFAULT false
)
WITH (OIDS=FALSE);
ALTER TABLE "phone" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for phonetype
-- ----------------------------
DROP TABLE IF EXISTS "phonetype";
CREATE TABLE "phonetype" (
	"phonetype" varchar(10) NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "phonetype" OWNER TO "dbreader";

-- ----------------------------
--  Records of phonetype
-- ----------------------------
BEGIN;
INSERT INTO "phonetype" VALUES ('cell');
INSERT INTO "phonetype" VALUES ('office');
INSERT INTO "phonetype" VALUES ('home');
COMMIT;

-- ----------------------------
--  Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS "project";
CREATE TABLE "project" (
	"id" uuid NOT NULL,
	"leadid" uuid NOT NULL,
	"install" timestamp(6) WITH TIME ZONE,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"completed" timestamp(6) WITH TIME ZONE,
	"addressid" uuid,
	"removed" bool,
	"designconsult" timestamp(6) WITH TIME ZONE
)
WITH (OIDS=FALSE);
ALTER TABLE "project" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for projectdetail
-- ----------------------------
DROP TABLE IF EXISTS "projectdetail";
CREATE TABLE "projectdetail" (
	"id" uuid NOT NULL,
	"projectid" uuid NOT NULL,
	"systemid" uuid,
	"areaprice" float8 DEFAULT 0,
	"area" float8 DEFAULT 0,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"name" varchar(250) NOT NULL COLLATE "default",
	"systemprice" float8,
	"systemsneeded" float8,
	"arealength" float8,
	"areawidth" float8,
	"removed" bool
)
WITH (OIDS=FALSE);
ALTER TABLE "projectdetail" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for projectdetailstyle
-- ----------------------------
DROP TABLE IF EXISTS "projectdetailstyle";
CREATE TABLE "projectdetailstyle" (
	"id" uuid NOT NULL,
	"ingredientid" uuid NOT NULL,
	"projectdetailid" uuid NOT NULL,
	"colorid" uuid,
	"patternid" uuid,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"purchaseprice" numeric NOT NULL DEFAULT 0,
	"chargeprice" numeric NOT NULL DEFAULT 0
)
WITH (OIDS=FALSE);
ALTER TABLE "projectdetailstyle" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for states
-- ----------------------------
DROP TABLE IF EXISTS "states";
CREATE TABLE "states" (
	"id" varchar(10) NOT NULL COLLATE "default",
	"countryid" varchar(10) NOT NULL COLLATE "default",
	"state" varchar(50) NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "states" OWNER TO "dbreader";

-- ----------------------------
--  Records of states
-- ----------------------------
BEGIN;
INSERT INTO "states" VALUES ('AL', 'US', 'Alabama');
INSERT INTO "states" VALUES ('AK', 'US', 'Alaska');
INSERT INTO "states" VALUES ('AZ', 'US', 'Arizona');
INSERT INTO "states" VALUES ('AR', 'US', 'Arkansas');
INSERT INTO "states" VALUES ('CA', 'US', 'California');
INSERT INTO "states" VALUES ('CO', 'US', 'Colorado');
INSERT INTO "states" VALUES ('CT', 'US', 'Connecticut');
INSERT INTO "states" VALUES ('DE', 'US', 'Delaware');
INSERT INTO "states" VALUES ('DC', 'US', 'District Of Columbia');
INSERT INTO "states" VALUES ('FL', 'US', 'Florida');
INSERT INTO "states" VALUES ('GA', 'US', 'Georgia');
INSERT INTO "states" VALUES ('HI', 'US', 'Hawaii');
INSERT INTO "states" VALUES ('ID', 'US', 'Idaho');
INSERT INTO "states" VALUES ('IL', 'US', 'Illinois');
INSERT INTO "states" VALUES ('IN', 'US', 'Indiana');
INSERT INTO "states" VALUES ('IA', 'US', 'Iowa');
INSERT INTO "states" VALUES ('KS', 'US', 'Kansas');
INSERT INTO "states" VALUES ('KY', 'US', 'Kentucky');
INSERT INTO "states" VALUES ('LA', 'US', 'Louisiana');
INSERT INTO "states" VALUES ('ME', 'US', 'Maine');
INSERT INTO "states" VALUES ('MD', 'US', 'Maryland');
INSERT INTO "states" VALUES ('MA', 'US', 'Massachusetts');
INSERT INTO "states" VALUES ('MI', 'US', 'Michigan');
INSERT INTO "states" VALUES ('MN', 'US', 'Minnesota');
INSERT INTO "states" VALUES ('MS', 'US', 'Mississippi');
INSERT INTO "states" VALUES ('MO', 'US', 'Missouri');
INSERT INTO "states" VALUES ('MT', 'US', 'Montana');
INSERT INTO "states" VALUES ('NE', 'US', 'Nebraska');
INSERT INTO "states" VALUES ('NV', 'US', 'Nevada');
INSERT INTO "states" VALUES ('NH', 'US', 'New Hampshire');
INSERT INTO "states" VALUES ('NJ', 'US', 'New Jersey');
INSERT INTO "states" VALUES ('NM', 'US', 'New Mexico');
INSERT INTO "states" VALUES ('NY', 'US', 'New York');
INSERT INTO "states" VALUES ('NC', 'US', 'North Carolina');
INSERT INTO "states" VALUES ('ND', 'US', 'North Dakota');
INSERT INTO "states" VALUES ('OH', 'US', 'Ohio');
INSERT INTO "states" VALUES ('OK', 'US', 'Oklahoma');
INSERT INTO "states" VALUES ('OR', 'US', 'Oregon');
INSERT INTO "states" VALUES ('PA', 'US', 'Pennsylvania');
INSERT INTO "states" VALUES ('RI', 'US', 'Rhode Island');
INSERT INTO "states" VALUES ('SC', 'US', 'South Carolina');
INSERT INTO "states" VALUES ('SD', 'US', 'South Dakota');
INSERT INTO "states" VALUES ('TN', 'US', 'Tennessee');
INSERT INTO "states" VALUES ('TX', 'US', 'Texas');
INSERT INTO "states" VALUES ('UT', 'US', 'Utah');
INSERT INTO "states" VALUES ('VT', 'US', 'Vermont');
INSERT INTO "states" VALUES ('VA', 'US', 'Virginia');
INSERT INTO "states" VALUES ('WA', 'US', 'Washington');
INSERT INTO "states" VALUES ('WV', 'US', 'West Virginia');
INSERT INTO "states" VALUES ('WI', 'US', 'Wisconsin');
INSERT INTO "states" VALUES ('WY', 'US', 'Wyoming');
INSERT INTO "states" VALUES ('AB', 'CA', 'Alberta');
INSERT INTO "states" VALUES ('BC', 'CA', 'British Columbia');
INSERT INTO "states" VALUES ('MB', 'CA', 'Manitoba');
INSERT INTO "states" VALUES ('NB', 'CA', 'New Brunswick');
INSERT INTO "states" VALUES ('NL', 'CA', 'Newfoundland and Labrador');
INSERT INTO "states" VALUES ('NS', 'CA', 'Nova Scotia');
INSERT INTO "states" VALUES ('ON', 'CA', 'Ontario');
INSERT INTO "states" VALUES ('PE', 'CA', 'Prince Edward Island');
INSERT INTO "states" VALUES ('QC', 'CA', 'Quebec');
INSERT INTO "states" VALUES ('SK', 'CA', 'Saskatchewan');
INSERT INTO "states" VALUES ('NT', 'CA', 'Northwest Territories');
INSERT INTO "states" VALUES ('NU', 'CA', 'Nunavut');
INSERT INTO "states" VALUES ('YT', 'CA', 'Yukon');
INSERT INTO "states" VALUES ('DIF', 'MX', 'Distrito Federal');
INSERT INTO "states" VALUES ('AGS', 'MX', 'Aguascalientes');
INSERT INTO "states" VALUES ('BCN', 'MX', 'Baja California');
INSERT INTO "states" VALUES ('BCS', 'MX', 'Baja California Sur');
INSERT INTO "states" VALUES ('CAM', 'MX', 'Campeche');
INSERT INTO "states" VALUES ('CHP', 'MX', 'Chiapas');
INSERT INTO "states" VALUES ('CHI', 'MX', 'Chihuahua');
INSERT INTO "states" VALUES ('COA', 'MX', 'Coahuila');
INSERT INTO "states" VALUES ('COL', 'MX', 'Colima');
INSERT INTO "states" VALUES ('DUR', 'MX', 'Durango');
INSERT INTO "states" VALUES ('GTO', 'MX', 'Guanajuato');
INSERT INTO "states" VALUES ('GRO', 'MX', 'Guerrero');
INSERT INTO "states" VALUES ('HGO', 'MX', 'Hidalgo');
INSERT INTO "states" VALUES ('JAL', 'MX', 'Jalisco');
INSERT INTO "states" VALUES ('MEX', 'MX', 'Mexico');
INSERT INTO "states" VALUES ('MIC', 'MX', 'Michoacan');
INSERT INTO "states" VALUES ('MOR', 'MX', 'Morelos');
INSERT INTO "states" VALUES ('NAY', 'MX', 'Nayarit');
INSERT INTO "states" VALUES ('NLE', 'MX', 'Nuevo Leon');
INSERT INTO "states" VALUES ('OAX', 'MX', 'Oaxaca');
INSERT INTO "states" VALUES ('PUE', 'MX', 'Puebla');
INSERT INTO "states" VALUES ('QRO', 'MX', 'Queretaro');
INSERT INTO "states" VALUES ('ROO', 'MX', 'Quintana Roo');
INSERT INTO "states" VALUES ('SLP', 'MX', 'San Luis Potosi');
INSERT INTO "states" VALUES ('SIN', 'MX', 'Sinaloa');
INSERT INTO "states" VALUES ('SON', 'MX', 'Sonora');
INSERT INTO "states" VALUES ('TAB', 'MX', 'Tabasco');
INSERT INTO "states" VALUES ('TAM', 'MX', 'Tamaulipas');
INSERT INTO "states" VALUES ('TLX', 'MX', 'Tlaxcala');
INSERT INTO "states" VALUES ('VER', 'MX', 'Veracruz');
INSERT INTO "states" VALUES ('YUC', 'MX', 'Yucatan');
INSERT INTO "states" VALUES ('ZAC', 'MX', 'Zacatecas');
COMMIT;

-- ----------------------------
--  Table structure for storage
-- ----------------------------
DROP TABLE IF EXISTS "storage";
CREATE TABLE "storage" (
	"id" uuid NOT NULL,
	"fid" uuid NOT NULL,
	"filename" varchar(100) NOT NULL COLLATE "default",
	"contenttype" varchar(100) NOT NULL COLLATE "default",
	"type" varchar(100) NOT NULL COLLATE "default",
	"hash" varchar(100) NOT NULL COLLATE "default",
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"container" varchar(200) NOT NULL COLLATE "default",
	"size" numeric NOT NULL DEFAULT 0
)
WITH (OIDS=FALSE);
ALTER TABLE "storage" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for system
-- ----------------------------
DROP TABLE IF EXISTS "system";
CREATE TABLE "system" (
	"id" uuid NOT NULL,
	"name" varchar(500) NOT NULL COLLATE "default",
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"status" int8 NOT NULL,
	"share" bool NOT NULL DEFAULT false
)
WITH (OIDS=FALSE);
ALTER TABLE "system" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for systemdetail
-- ----------------------------
DROP TABLE IF EXISTS "systemdetail";
CREATE TABLE "systemdetail" (
	"id" uuid NOT NULL,
	"systemid" uuid NOT NULL,
	"ingredientid" uuid NOT NULL,
	"extra" varchar(100) NOT NULL DEFAULT ''::character varying COLLATE "default",
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL,
	"status" int8 NOT NULL,
	"factor" int8 NOT NULL DEFAULT 1,
	"price" numeric NOT NULL DEFAULT 0
)
WITH (OIDS=FALSE);
ALTER TABLE "systemdetail" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for team
-- ----------------------------
DROP TABLE IF EXISTS "team";
CREATE TABLE "team" (
	"id" uuid NOT NULL,
	"name" varchar(500) NOT NULL COLLATE "default",
	"version" int8 NOT NULL DEFAULT 0,
	"status" int8 NOT NULL,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "team" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for teamdetail
-- ----------------------------
DROP TABLE IF EXISTS "teamdetail";
CREATE TABLE "teamdetail" (
	"id" uuid NOT NULL,
	"teamid" uuid NOT NULL,
	"personid" uuid NOT NULL,
	"version" int8 NOT NULL DEFAULT 0,
	"status" int8 NOT NULL,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "teamdetail" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for teamlead
-- ----------------------------
DROP TABLE IF EXISTS "teamlead";
CREATE TABLE "teamlead" (
	"id" uuid NOT NULL,
	"teamid" uuid NOT NULL,
	"personid" uuid NOT NULL,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "teamlead" OWNER TO "dbreader";

-- ----------------------------
--  Table structure for teamsystem
-- ----------------------------
DROP TABLE IF EXISTS "teamsystem";
CREATE TABLE "teamsystem" (
	"id" uuid NOT NULL,
	"teamid" uuid NOT NULL,
	"systemid" uuid NOT NULL,
	"status" int8 NOT NULL DEFAULT 1,
	"version" int8 NOT NULL DEFAULT 0,
	"added" timestamp(6) WITH TIME ZONE NOT NULL,
	"addedby" uuid NOT NULL,
	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
	"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "teamsystem" OWNER TO "dbreader";

-- ----------------------------
--  Primary key structure for table account
-- ----------------------------
ALTER TABLE "account" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table account
-- ----------------------------
CREATE unique INDEX ix_account_username ON account ((lower(username)));

-- ----------------------------
--  Primary key structure for table accountrole
-- ----------------------------
ALTER TABLE "accountrole" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table accountrole
-- ----------------------------
CREATE UNIQUE INDEX  "ix_accountrole_accountid_role" ON "accountrole" USING btree(accountid ASC NULLS LAST, "role" COLLATE "default" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table address
-- ----------------------------
ALTER TABLE "address" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table address
-- ----------------------------
CREATE INDEX  "ix_address_personid" ON "address" USING btree(personid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table addresstype
-- ----------------------------
ALTER TABLE "addresstype" ADD PRIMARY KEY ("addresstype") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table addresstype
-- ----------------------------
CREATE UNIQUE INDEX  "ix_addresstype_fks" ON "addresstype" USING btree(addresstype COLLATE "default" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table color
-- ----------------------------
ALTER TABLE "color" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table color
-- ----------------------------
CREATE unique INDEX ix_color_name ON color ((lower(name)));

-- ----------------------------
--  Indexes structure for table countries
-- ----------------------------
CREATE UNIQUE INDEX  "ix_countries_fks" ON "countries" USING btree("id" COLLATE "default" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table ingredient
-- ----------------------------
ALTER TABLE "ingredient" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table ingredient
-- ----------------------------
CREATE unique INDEX ix_ingredient_name ON ingredient ((lower(name)));
-- ----------------------------
--  Primary key structure for table ingredientcolor
-- ----------------------------
ALTER TABLE "ingredientcolor" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table ingredientcolor
-- ----------------------------
CREATE UNIQUE INDEX  "ix_ingredientcolor_uniq" ON "ingredientcolor" USING btree(ingredientid ASC NULLS LAST, colorid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table ingredientpattern
-- ----------------------------
ALTER TABLE "ingredientpattern" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table ingredientpattern
-- ----------------------------
CREATE UNIQUE INDEX  "ix_ingredientpattern_uniq" ON "ingredientpattern" USING btree(ingredientid ASC NULLS LAST, patternid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table lead
-- ----------------------------
ALTER TABLE "lead" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table lead
-- ----------------------------
CREATE UNIQUE INDEX  "ix_lead_personid" ON "lead" USING btree(personid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table leaddetail
-- ----------------------------
ALTER TABLE "leaddetail" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table leaddetail
-- ----------------------------
CREATE UNIQUE INDEX  "ix_leaddetail_leadid" ON "leaddetail" USING btree(leadid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table note
-- ----------------------------
ALTER TABLE "note" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table note
-- ----------------------------
CREATE INDEX  "ix_note_fid" ON "note" USING btree(fid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table pattern
-- ----------------------------
ALTER TABLE "pattern" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table pattern
-- ----------------------------
CREATE unique INDEX ix_pattern_name ON pattern ((lower(name)));

-- ----------------------------
--  Primary key structure for table person
-- ----------------------------
ALTER TABLE "person" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table phone
-- ----------------------------
ALTER TABLE "phone" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table phone
-- ----------------------------
CREATE INDEX  "ix_phone_personid" ON "phone" USING btree(personid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table phonetype
-- ----------------------------
ALTER TABLE "phonetype" ADD PRIMARY KEY ("phonetype") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table phonetype
-- ----------------------------
CREATE UNIQUE INDEX  "ix_phonetype_fks" ON "phonetype" USING btree(phonetype COLLATE "default" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table project
-- ----------------------------
ALTER TABLE "project" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table project
-- ----------------------------
CREATE INDEX  "ix_project_leadid" ON "project" USING btree(leadid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table projectdetail
-- ----------------------------
ALTER TABLE "projectdetail" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table projectdetailstyle
-- ----------------------------
ALTER TABLE "projectdetailstyle" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table projectdetailstyle
-- ----------------------------
CREATE UNIQUE INDEX  "ix_projectdetailstyle_uniq" ON "projectdetailstyle" USING btree(ingredientid ASC NULLS LAST, projectdetailid ASC NULLS LAST);

-- ----------------------------
--  Indexes structure for table states
-- ----------------------------
CREATE UNIQUE INDEX  "ix_states_fks" ON "states" USING btree(countryid COLLATE "default" ASC NULLS LAST, "id" COLLATE "default" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table storage
-- ----------------------------
ALTER TABLE "storage" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table storage
-- ----------------------------
CREATE INDEX  "ix_projectimage_fid" ON "storage" USING btree(fid ASC NULLS LAST, "type" COLLATE "default" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table system
-- ----------------------------
ALTER TABLE "system" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table system
-- ----------------------------
CREATE unique INDEX ix_system_name ON system ((lower(name)));

-- ----------------------------
--  Primary key structure for table systemdetail
-- ----------------------------
ALTER TABLE "systemdetail" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table systemdetail
-- ----------------------------
CREATE UNIQUE INDEX  "ix_systemdetail_system_ingredient" ON "systemdetail" USING btree(systemid ASC NULLS LAST, ingredientid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table team
-- ----------------------------
ALTER TABLE "team" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table teamdetail
-- ----------------------------
ALTER TABLE "teamdetail" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table teamdetail
-- ----------------------------
CREATE UNIQUE INDEX  "ix_teamdetail_people" ON "teamdetail" USING btree(teamid ASC NULLS LAST, personid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table teamlead
-- ----------------------------
ALTER TABLE "teamlead" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table teamlead
-- ----------------------------
CREATE UNIQUE INDEX  "ix_teamlead_uniq" ON "teamlead" USING btree(teamid ASC NULLS LAST, personid ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table teamsystem
-- ----------------------------
ALTER TABLE "teamsystem" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table teamsystem
-- ----------------------------
CREATE UNIQUE INDEX  "ix_teamsystem_uniq" ON "teamsystem" USING btree(teamid ASC NULLS LAST, systemid ASC NULLS LAST);

