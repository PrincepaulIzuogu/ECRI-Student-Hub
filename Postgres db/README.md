### Viewing PostgreSQL Database on the Web (Port 5432)

By default, PostgreSQL uses port 5432 for database connections rather than serving web content. Therefore, you cannot directly view the PostgreSQL database in a web browser on port 5432. However, you can utilize a database management tool that offers a web interface to interact with the PostgreSQL database.

**Using pgAdmin4 via Docker Compose**
To facilitate web-based access to your PostgreSQL database, pgAdmin4 was added to your Docker Compose setup. PgAdmin4 provides a convenient web interface for managing PostgreSQL databases.


# Securing Sensitive Data:
to ensure that sensitive data, such as login credentials, are securely managed. This was achieved by storing them as environment variables or utilizing tools like GitHub Secrets.

# Accessing pgAdmin:
Once the Docker containers are running, access pgAdmin via a web browser using the specified port. Log in using the provided credentials.

# Connecting to PostgreSQL:
Within pgAdmin, add a new server connection using the host, port, database name, username, and password provided. This allows you to view and manage your PostgreSQL database through the pgAdmin web interface.

Alternative Access via Terminal
If you prefer, you can also access the PostgreSQL database via the terminal using the psql command. Simply run:

# code
psql -h localhost -U postgres -d student_db
You will be prompted to enter the password when connecting.
