# Feedback Backend API

A Node.js backend service for handling feedback submissions with email notifications.

## Features

- ✅ Store feedback in MongoDB
- 📧 Send email notifications to admin
- 🔒 Input validation
- 🎯 RESTful API design
- 📊 Feedback management (CRUD operations)
- 🚀 ES Modules (type: module)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Nodemailer** - Email service
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

## Project Structure

```
Send_Email/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── feedbackController.js # Business logic
├── models/
│   └── Feedback.js          # Database schema
├── routes/
│   └── feedbackRoutes.js    # API endpoints
├── utils/
│   └── emailService.js      # Email configuration
├── .env                     # Environment variables
├── .env.example            # Example environment file
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── server.js               # Entry point
└── README.md               # Documentation
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your credentials

3. **Setup MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud)
   - Update `MONGODB_URI` in `.env`

4. **Setup Email (Gmail example):**
   - Enable 2-factor authentication
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Update `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`

## Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### Submit Feedback
```
POST /api/feedback
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is my feedback message"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully! We will get back to you soon.",
  "data": {
    "id": "65f123abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Admin Endpoints

#### Get All Feedbacks
```
GET /api/feedback?status=pending&page=1&limit=10
```

#### Get Single Feedback
```
GET /api/feedback/:id
```

#### Update Feedback Status
```
PATCH /api/feedback/:id/status
Content-Type: application/json

{
  "status": "read"  // pending | read | responded
}
```

#### Delete Feedback
```
DELETE /api/feedback/:id
```

## Frontend Integration

Update your React form to call the API:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message
      })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Feedback submitted successfully!');
      // Clear form
      setName('');
      setEmail('');
      setMessage('');
    } else {
      alert('Failed to submit feedback. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again later.');
  }
};
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/feedback_db |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email address | your-email@gmail.com |
| EMAIL_PASSWORD | Email app password | your-app-password |
| ADMIN_EMAIL | Admin notification email | admin@example.com |
| CLIENT_URL | Frontend URL (for CORS) | http://localhost:3000 |

## Email Configuration

### Gmail Setup

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as `EMAIL_PASSWORD` in `.env`

### Other Email Providers

**Outlook/Hotmail:**
```
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**Yahoo:**
```
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

## Testing

Test the API using:
- **Postman** or **Insomnia**
- **curl** command
- Frontend application

**Example curl command:**
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### Email Not Sending
- Verify email credentials
- Check if App Password is correct (for Gmail)
- Ensure less secure app access is enabled (if not using App Password)
- Check spam/junk folder

### CORS Errors
- Update `CLIENT_URL` in `.env` to match your frontend URL
- Ensure CORS is properly configured

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

