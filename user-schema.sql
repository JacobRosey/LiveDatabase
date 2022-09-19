CREATE TABLE `simplelogin`.`Users` 
(`prim_key` INT NOT NULL AUTO_INCREMENT , 
`username` VARCHAR(16) NOT NULL , 
`password` VARCHAR(60) NOT NULL , 
PRIMARY KEY (`prim_key`)) ENGINE = InnoDB;