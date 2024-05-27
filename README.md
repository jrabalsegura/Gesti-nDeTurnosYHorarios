# Gestión De Turnos Y Horarios

This project is a web application developed for managing employee shifts and schedules. It provides features for tracking employee attendance, managing absences, generating payroll, and more.

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JSON Web Tokens (JWT) for authentication
  - AWS SDK for file uploads
  - SendGrid for email notifications
  - Croner and node-cron for scheduled tasks
- Frontend:
  - React
- Testing:
  - Jest
  - Supertest

## Testing

The project includes unit tests written using Jest and Supertest library. The tests ensure the correctness of individual components API endpoints. To run the tests, use the following command:

```bash
yarn test
```

## Deployment

This project is designed to work in conjunction with the backend project GestionDeTurnosYHorarios. To deploy both projects together, follow these steps:

1. Clone both repositories:

```bash
git clone https://github.com/jrabalsegura/FrontGestionDeTurnosYHorarios.git
git clone https://github.com/jrabalsegura/GestionDeTurnosYHorarios.git
```

2. Crear .env variables:

Frontend:
API=http://localhost:4014
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=12345678

Backend:
PORT=4014
DB_CNN=
JWT_SECRET=ESTEESMIPROYECTOFINDEGRADO123987_45
API_ENDPOINT=http://localhost:4014
API_ENDPOINTHEROKU=https://gestion-horarios-cd0d24b996c6.herokuapp.com
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=12345678
SENDGRID_API_KEY=
NODE_ENV=development
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=

3. In the frontend project's directory, use Docker Compose to start both the frontend and backend services:

```bash
docker compose up
```

4. Open the application in your browser at `http://localhost:3010`

## Contributing

Contributions to the project are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more information.
