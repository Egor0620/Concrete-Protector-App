/**
 * Created by tbbates on 9/5/14.
 */
 drop database if exists "concrete";

 create database concrete;

 CREATE role "dbreader" password 'dbReaderPassword' LOGIN;

  grant all privileges on database concrete to dbreader;


  /*
  also read this:
  http://stackoverflow.com/questions/17443379/psql-fatal-peer-authentication-failed-for-user-dev
  */