/*
 * Created by tbbates on 3/5/15.
 */
  -- add share to storage
  alter table storage add column share bool not null default false;

 -- add permission to team lead
 alter table teamlead add column permission int8 not null default 0;

 -- add permission to team system
 alter table teamsystem add column permission int8 not null default 0;

 DROP TABLE IF EXISTS "team";
 CREATE TABLE "team" (
 	"id" uuid NOT NULL,
 	"personid" uuid NOT NULL,
 	"permission" int8 NOT NULL DEFAULT 0,
 	"version" int8 NOT NULL DEFAULT 0,
 	"status" int8 NOT NULL DEFAULT 1,
 	"added" timestamp(6) WITH TIME ZONE NOT NULL,
 	"addedby" uuid NOT NULL,
 	"changed" timestamp(6) WITH TIME ZONE NOT NULL,
 	"changedby" uuid NOT NULL
 )
 WITH (OIDS=FALSE);
 ALTER TABLE "team" OWNER TO "dbreader";
 ALTER TABLE "team" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;
 CREATE UNIQUE INDEX  "ix_team_uniq" ON "team" USING btree(personid ASC NULLS LAST, addedby ASC NULLS LAST);

-- add contract template
DROP TABLE IF EXISTS "contracttemplate";
CREATE TABLE "contracttemplate" (
"id" uuid NOT NULL,
"name" varchar(100) NOT NULL COLLATE "default",
"type" varchar(100) NOT NULL COLLATE "default",
"termid" uuid,
"headerid" uuid,
"footerid" uuid,
"layoutid" uuid NOT NULL,
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "contracttemplate" OWNER TO "dbreader";
ALTER TABLE "contracttemplate" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- add contract
DROP TABLE IF EXISTS "contract";
CREATE TABLE "contract" (
"id" uuid NOT NULL,
"signatureid" uuid,
"signaturedate" timestamp(6) WITH TIME ZONE,
"templateid" uuid NOT NULL,
"termid" uuid NOT NULL,
"headerid" uuid,
"footerid" uuid,
"projectid" uuid NOT NULL,
"price" numeric NOT NULL DEFAULT 0,
"discount" numeric NOT NULL DEFAULT 0,
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "contract" OWNER TO "dbreader";
ALTER TABLE "contract" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- add contract project
DROP TABLE IF EXISTS "contractproject";
CREATE TABLE "contractproject" (
"id" uuid NOT NULL,
"leadid" uuid NOT NULL,
"leadversion" int8 NOT NULL DEFAULT 0,
"firstname" varchar(100),
"lastname" varchar(100),
"company" varchar(250),
"leaddetailid" uuid NOT NULL,
"leaddetailversion" int8 NOT NULL DEFAULT 0,
"email" varchar(100),
"besttimetocall" varchar(100),
"addressid" uuid NOT NULL,
"addressversion" int8 NOT NULL DEFAULT 0,
"address1" varchar(100),
"address2" varchar(100),
"city" varchar(100),
"state" varchar(10),
"zip" varchar(100),
"addresstype" varchar(20),
"phoneid" uuid NOT NULL,
"phoneversion" int8 NOT NULL DEFAULT 0,
"phonenumber" varchar(10),
"install" timestamp(6) WITH TIME ZONE,
"completed" timestamp(6) WITH TIME ZONE,
"designconsult" timestamp(6) WITH TIME ZONE,
"projectid" uuid NOT NULL,
"projectversion" int8 NOT NULL DEFAULT 0,
"contractid" uuid NOT NULL,
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "contractproject" OWNER TO "dbreader";
ALTER TABLE "contractproject" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;


-- add contract project system
DROP TABLE IF EXISTS "contractprojectdetail";
CREATE TABLE "contractprojectdetail" (
"id" uuid NOT NULL,
"contractprojectid" uuid NOT NULL,
"projectid" uuid NOT NULL,
"projectdetailid" uuid NOT NULL,
"projectdetailversion" int8 NOT NULL DEFAULT 0,
"systemid" uuid NOT NULL,
"systemversion" int8 NOT NULL DEFAULT 0,
"systemname" varchar(500),
"area" float8 DEFAULT 0,
"systemsneeded" float8,
"arealength" float8,
"areawidth" float8,
"saleprice" numeric NOT NULL DEFAULT 0,
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "contractprojectdetail" OWNER TO "dbreader";
ALTER TABLE "contractprojectdetail" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;


-- add contract project detail ingredient
DROP TABLE IF EXISTS "contractprojectdetailingredient";
CREATE TABLE "contractprojectdetailingredient" (
"id" uuid NOT NULL,
"contractprojectdetailid" uuid NOT NULL,
"projectdetailid" uuid NOT NULL,
"projectdetailversion" int8 NOT NULL DEFAULT 0,
"ingredientid" uuid NOT NULL,
"ingredientversion" int8 NOT NULL DEFAULT 0,
"ingredientname" varchar(500),
"ingredientcoverage" int8 DEFAULT 0,
"ingredientpurchaseprice" numeric NOT NULL DEFAULT 0,
"colorid" uuid,
"colorversion" int8,
"colorname" varchar(100),
"patternid" uuid,
"patternversion" int8,
"patternname" varchar(100),
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "contractprojectdetailingredient" OWNER TO "dbreader";
ALTER TABLE "contractprojectdetailingredient" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;


-- add contract pictures
DROP TABLE IF EXISTS "contractprojectimage";
CREATE TABLE "contractprojectimage" (
"id" uuid NOT NULL,
"projectid" uuid NOT NULL,
"projectversion" int8 NOT NULL DEFAULT 0,
"contractid" uuid NOT NULL,
"storageid" uuid NOT NULL,
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "contractprojectimage" OWNER TO "dbreader";
ALTER TABLE "contractprojectimage" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- add contract notes
DROP TABLE IF EXISTS "contractprojectnote";
CREATE TABLE "contractprojectnote" (
"id" uuid NOT NULL,
"projectid" uuid NOT NULL,
"projectversion" int8 NOT NULL DEFAULT 0,
"contractid" uuid NOT NULL,
"noteid" uuid NOT NULL,
"noteversion" int8 NOT NULL DEFAULT 0,
"notebody"  varchar(250),
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "contractprojectnote" OWNER TO "dbreader";
ALTER TABLE "contractprojectnote" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- add ignore
DROP TABLE IF EXISTS "ignore";
CREATE TABLE "ignore" (
"id" uuid NOT NULL,
"fid" uuid NOT NULL,
"type" varchar(100) NOT NULL COLLATE "default",
"version" int8 NOT NULL DEFAULT 0,
"status" int8 NOT NULL DEFAULT 1,
"added" timestamp(6) WITH TIME ZONE NOT NULL,
"addedby" uuid NOT NULL,
"changed" timestamp(6) WITH TIME ZONE NOT NULL,
"changedby" uuid NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "ignore" OWNER TO "dbreader";
ALTER TABLE "ignore" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE UNIQUE INDEX  "ix_ignore_uniq" ON "ignore" USING btree(fid ASC NULLS LAST, addedby ASC NULLS LAST, type ASC NULLS LAST);