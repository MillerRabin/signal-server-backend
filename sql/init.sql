create database signal

create user master;
grant all on database signal to master;
alter user master password '1q2w3e!@';
alter user postgres password '1q2w3e!@';

drop database postgres;

create table offers
(
    id serial primary key,
    offer text not null,
    ip cidr not null
)

insert into offers(offer, ip)

select * from offers;