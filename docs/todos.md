# Todos

## Pending

Style the Header and Footer.

Start working on how to add bike riding data.

Create the "data" api routes and serverless functions.

Get a new biking-log.noreply@gmail.com email address and switch over to it (includes setting up oauth2 at google).

## Done

Convert these database fields (from/to) in the database (resetPasswordToken remains in next-auth and in the cookie):

-   resetPasswordToken to reset_password_token
-   resetPasswordExpires to reset_password_expires

Find a remote SQL server to use with this app... maybe mariaDB on AWS? So far I've gone with Planet Scale.

Add a salt column to the users table in the database.

There is a bug in the DatePicker component where it's not reliably collapsing when a date is picked. The DatePicker component cannot be inside a label tag or this behavior will occur.

Move the error p tag in FormInput inside the label element. I also changed it to a span tag.

Fix the regex error in the formInputPatterns so they can accept dashes. The fix is to use double backslashes.

Finish moving everything to the appDir (pages, components and api routes).
