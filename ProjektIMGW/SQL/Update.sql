CREATE SCHEMA [User]
GO

CREATE TABLE [User].[Users] (
    UserId BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	Login VARCHAR(50) UNIQUE NOT NULL,
	Email VARCHAR(50) UNIQUE NOT NULL,
	Password VARCHAR(32) NOT NULL,
    LastSuccessfulLogin DATETIME,
	IsEnabled BIT NOT NULL
)

INSERT INTO [User].[Users] (
     Login
	,Email
	,Password
	,LastSuccessfulLogin
	,IsEnabled
	)
VALUES (
     'admin'
	,'admin@administracja.com'
	,CONVERT(VARCHAR(32), HashBytes('MD5', 'admin'), 2)
	,NULL
	,1
)
,(
     'jan'
	,'jan@gamil.com'
	,CONVERT(VARCHAR(32), HashBytes('MD5', 'haslo'), 2)
	,NULL
	,1
)

GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 24.04.2021
-- Description:	Procedura sprawdzająca podane dane przy logowaniu
-- =============================================
CREATE PROCEDURE [User].[CheckLoginDetails]
	@Login VARCHAR(50),
	@Password VARCHAR(32)
AS
BEGIN
	SELECT IsCorrent = 
		CASE
			WHEN Count(0) > 0 THEN 1
			WHEN Count(0) = 0 THEN 0
		END
	FROM [User].[Users]
	WHERE
		(Login = @Login OR Email = @Login)
	AND Password = @Password
END
GO

CREATE SCHEMA [CurrentConditions]
GO

CREATE TABLE [CurrentConditions].[AgriculturalTechniques] (
	AgriculturalTechniquesId BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	UserId BIGINT NOT NULL,
	AgriculturalDate DATE NOT NULL,
	ActionId TINYINT NOT NULL,
	Data1 VARCHAR(30),
	Data2 VARCHAR(30)
)

INSERT INTO [CurrentConditions].[AgriculturalTechniques] (
	 UserId
	,AgriculturalDate
	,ActionId
	,Data1
	,Data2
)
VALUES(
	 1
	,'06.02.2020'
	,1
	,'Wlasny'
	,'Owies'
)
,(
	 1
	,'06.20.2020'
	,2
	,'N'
	,'12'
)

CREATE TABLE [CurrentConditions].[Actions](
	ActionId TINYINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	Name VARCHAR(30) NOT NULL,
	IsEnabled BIT NOT NULL
)

INSERT INTO [CurrentConditions].[Actions] (
	 Name
	,IsEnabled
)
VALUES(
	 'Nawoz (organiczny)'
	,1
)
,(
	 'Nawoz (mineralny)'
	,1
)
,(
	 'Nawodnienie'
	,1
)
,(
	 'Siew'
	,1
)
,(
	 'Zbior'
	,1
)

GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 24.04.2021
-- Description:	Procedura pobiera dane do tabeli Zabiegi Agroturystyczne
-- =============================================
CREATE PROCEDURE [User].[LastSuccessfulLoginSet]
	@Login VARCHAR(50)
AS
BEGIN
	UPDATE [User].[Users] 
	SET LastSuccessfulLogin = GETDATE() 
	WHERE Login = @Login OR Email = @Login
END
GO

GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 24.04.2021
-- Description:	Procedura pobiera dane do tabeli Zabiegi Agroturystyczne
-- =============================================
CREATE PROCEDURE [CurrentConditions].[AgriculturalTechniquesGet]
	@Login VARCHAR(50)
AS
BEGIN
	SELECT
		 CONVERT(NVARCHAR, at.AgriculturalDate, 4)
		,a.Name
		,at.Data1
		,at.Data2
	FROM
		[CurrentConditions].[AgriculturalTechniques] at
	JOIN [CurrentConditions].[Actions] a
	ON a.ActionId = at.ActionId
	JOIN [User].[Users] u
	ON u.UserId = at.UserId
	WHERE
		u.Login = @Login OR u.Email = @Login
END
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 24.04.2021
-- Description:	Procedura dodaje dane do tabeli Zabiegi Agroturystyczne
-- =============================================
CREATE PROCEDURE [CurrentConditions].[AgriculturalTechniquesAdd]
	 @Login VARCHAR(50)
	,@AgriculturalDate DATE
	,@ActionId TINYINT
	,@Data1 VARCHAR(32)
	,@Data2 VARCHAR(32)
AS
BEGIN
	DECLARE @UserId BIGINT
	SELECT @UserId = UserId FROM [User].[Users] WHERE Login = @Login OR Email = @Login

	INSERT INTO [CurrentConditions].[AgriculturalTechniques](
		 UserId
		,AgriculturalDate
		,ActionId
		,Data1
		,Data2
	)
	VALUES(
		 @UserId
		,@AgriculturalDate
		,@ActionId
		,@Data1
		,@Data2
	)
END
GO

CREATE TABLE [CurrentConditions].[PlantTypes](
	PlantTypeid TINYINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	Name VARCHAR(30) UNIQUE NOT NULL,
	IsEnabled BIT NOT NULL
)
GO

INSERT INTO [CurrentConditions].[PlantTypes] (
	 Name
	,IsEnabled
)
VALUES(
	 'Kukurydza'
	,1
)
,(
	 'Pszenica'
	,1
)
,(
	 'Zyto'
	,1
)
,(
	 'Rzepak'
	,1
)
GO

CREATE TABLE [CurrentConditions].[CultivationStates](
	CultivationStateId TINYINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	Name VARCHAR(30) UNIQUE NOT NULL,
	IsEnabled BIT NOT NULL
)
GO

INSERT INTO [CurrentConditions].[CultivationStates] (
	 Name
	,IsEnabled
)
VALUES(
	 'Dobra'
	,1
)
,(
	 'Srednia'
	,1
)
,(
	 'Slaba'
	,1
)
GO

CREATE TABLE [CurrentConditions].[CurrentConditions](
	CurrentConditionId BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	UserId BIGINT NOT NULL,
	PlantTypeid TINYINT NOT NULL,
	SowingDate DATE NOT NULL,
	CultivationStateId TINYINT NOT NULL
)
GO

INSERT INTO [CurrentConditions].[CurrentConditions] (
	 UserId
	,PlantTypeid
	,SowingDate
	,CultivationStateId
)
VALUES(
	 1
	,1
	,'06.20.2020'
	,1
)
,(
	 1
	,2
	,'06.02.2020'
	,2
)
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 25.04.2021
-- Description:	Procedura pobiera dane do tabeli Warunki bieżące
-- =============================================
CREATE PROCEDURE [CurrentConditions].[CurrentConditionsGet]
	@Login VARCHAR(50)
AS
BEGIN
	SELECT 
		 pt.Name AS PlantName
		,cc.SowingDate
		,cs.Name AS State
	FROM 
		[CurrentConditions].[CurrentConditions] cc
	JOIN [CurrentConditions].[PlantTypes] pt
	ON pt.PlantTypeid = cc.PlantTypeid
	JOIN [CurrentConditions].[CultivationStates] cs
	ON cs.CultivationStateId = cc.CultivationStateId
	JOIN [User].[Users] u
	ON u.UserId = cc.UserId
	WHERE
		u.Login = @Login OR u.Email = @Login
END
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 25.04.2021
-- Description:	Procedura dodaje dane do tabeli Warunki bieżące
-- =============================================
CREATE PROCEDURE [CurrentConditions].[CurrentConditionsAdd]
	 @Login VARCHAR(50)
	,@PlantTypeId TINYINT
	,@SowingDate DATE
	,@CultivationStateId TINYINT
AS
BEGIN
	DECLARE @UserId BIGINT
	SELECT @UserId = UserId FROM [User].[Users] WHERE Login = @Login OR Email = @Login

	INSERT INTO [CurrentConditions].[CurrentConditions] (
	 UserId
	,PlantTypeid
	,SowingDate
	,CultivationStateId
)
VALUES(
	 @UserId
	,@PlantTypeid
	,@SowingDate
	,@CultivationStateId
)
END
GO

CREATE TABLE [CurrentConditions].[Events](
	EventId BIGINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	UserId BIGINT NOT NULL,
	EventDate DATE NOT NULL,
	EventTypeId TINYINT NOT NULL,
	LossesPercentage TINYINT NOT NULL,
	PhotoPath VARCHAR(80)
)
GO

INSERT INTO [CurrentConditions].[Events] (
	 UserId
	,EventDate
	,EventTypeId
	,LossesPercentage
	,PhotoPath
)
VALUES(
	 1
	,'02-06-2021'
	,1
	,15
	,'C:\zdj.jpg'
)
,(
	 1
	,'12-04-2021'
	,2
	,50
	,'C:\zdj2.jpg'
)
GO
CREATE TABLE [CurrentConditions].[EventTypes](
	EventTypeId TINYINT NOT NULL PRIMARY KEY IDENTITY(1,1),
	Name VARCHAR(15) NOT NULL,
	IsEnabled BIT NOT NULL
)
GO

INSERT INTO [CurrentConditions].[EventTypes] (
	 Name
	,IsEnabled
)
VALUES(
	 'Ulewa'
	,1
)
,(
	 'Deszcz'
	,1
)
,(
	 'Susza'
	,1
)
,(
	 'Przymrozek'
	,1
)
,(
	 'Agrofagi'
	,1
)
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 25.04.2021
-- Description:	Procedura pobiera dane do tabeli Dziennik zdarzeń
-- =============================================
CREATE PROCEDURE [CurrentConditions].[EventsGet]
	@Login VARCHAR(50)
AS
BEGIN
	SELECT 
		 e.EventDate
		,et.Name AS EventName
		,e.LossesPercentage
		,e.PhotoPath
	FROM 
		[CurrentConditions].[Events] e
	JOIN [CurrentConditions].[EventTypes] et
	ON et.EventTypeId = e.EventTypeId
	JOIN [User].[Users] u
	ON u.UserId = e.UserId
	WHERE
		u.Login = @Login OR u.Email = @Login
END
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 25.04.2021
-- Description:	Procedura dodaje dane do tabeli Dziennik zdarzeń
-- =============================================
CREATE PROCEDURE [CurrentConditions].[EventsAdd]
	 @Login VARCHAR(50)
	,@EventDate DATE
	,@EventTypeId TINYINT
	,@LossesPercentage TINYINT
	,@PhotoPath VARCHAR(80)
AS
BEGIN
	DECLARE @UserId BIGINT
	SELECT @UserId = UserId FROM [User].[Users] WHERE Login = @Login OR Email = @Login

	INSERT INTO [CurrentConditions].[Events] (
		 UserId
		,EventDate
		,EventTypeId
		,LossesPercentage
		,PhotoPath
	)
	VALUES(
		 @UserId
		,@EventDate
		,@EventTypeId
		,@LossesPercentage
		,@PhotoPath
	)
END
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 24.04.2021
-- Description:	Procedura pobierająca listę możliwych akcji do wyboru
-- =============================================
CREATE PROCEDURE [CurrentConditions].[ActionsListGet]
AS
BEGIN
	SELECT
	 ActionId
	,Name
FROM 
	[CurrentConditions].[Actions]
WHERE
	IsEnabled = 1
END
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 24.04.2021
-- Description:	Procedura pobierająca listę typów roślin
-- =============================================
CREATE PROCEDURE [CurrentConditions].[PlantsListGet]
AS
BEGIN
	SELECT
	 PlantTypeId
	,Name
FROM 
	[CurrentConditions].[PlantTypes]
WHERE
	IsEnabled = 1
END
GO
-- =============================================
-- Author:		Paweł Gawarecki
-- Create date: 24.04.2021
-- Description:	Procedura pobierająca listę stanów upraw
-- =============================================
CREATE PROCEDURE [CurrentConditions].[CultivationStatesListGet]
AS
BEGIN
	SELECT
	 CultivationStateId
	,Name
FROM 
	[CurrentConditions].[CultivationStates]
WHERE
	IsEnabled = 1
END
GO