-- add saleprice to the system table
alter table system add column "saleprice" numeric default 0 not null;

-- add projectstatus to the project table
alter table project add column "projectstatus" varchar(100) default '' not null;

-- add saleprice to the projectdetail table
alter table projectdetail add column "saleprice" numeric default 0 not null;

-- remove systemprice to the project detail table
ALTER TABLE projectdetail DROP COLUMN systemprice RESTRICT;

-- remove areaprice to the project detail table
ALTER TABLE projectdetail DROP COLUMN areaprice RESTRICT;

-- remove purchaseprice to the projectdetailstyle table
ALTER TABLE projectdetailstyle DROP COLUMN purchaseprice RESTRICT;

-- remove chargeprice to the projectdetailstyle table
ALTER TABLE projectdetailstyle DROP COLUMN chargeprice RESTRICT;
