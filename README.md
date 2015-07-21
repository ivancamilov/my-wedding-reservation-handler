Short docs
==============

This is a simple REST service that handles reservations. A reservation has:

```
Reservation
- ID (set automatically by Mongoose)
- Name
- Date
- Guests
```

The service handles POST, PUT, and GET requests:

```
POST /reservations -> Create a reservation
PUT /reservations/name -> Updates a reservation with a given name
GET /reservations/name -> Gets a reservation with a given name
```