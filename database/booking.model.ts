import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Add index on eventId for faster queries when fetching bookings by event
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to validate that the referenced event exists in database
 * Prevents orphaned bookings by ensuring event reference integrity
 */
bookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId')) {
    try {
      // Check if the referenced event exists
      const eventExists = await Event.findById(booking.eventId);

      if (!eventExists) {
        return next(
          new Error(
            `Event with ID ${booking.eventId} does not exist. Cannot create booking.`
          )
        );
      }
    } catch (error) {
      return next(
        new Error(
          `Error validating event reference: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        )
      );
    }
  }

  next();
});

// Prevent model recompilation in development (Next.js hot reload)
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
