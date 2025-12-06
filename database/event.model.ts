import mongoose, { Document, Model, Schema } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string;
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
      trim: true,
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: String,
      required: [true, 'Agenda is required'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Add unique index on slug for faster lookups and uniqueness enforcement
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to generate slug from title and normalize date/time
 * Only regenerates slug if title has been modified
 */
eventSchema.pre('save', function (next) {
  const event = this as IEvent;

  // Generate URL-friendly slug from title if title changed
  if (event.isModified('title')) {
    event.slug = event.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Validate and normalize date to ISO format (YYYY-MM-DD)
  if (event.isModified('date')) {
    const parsedDate = new Date(event.date);
    
    if (isNaN(parsedDate.getTime())) {
      return next(new Error('Invalid date format. Please provide a valid date.'));
    }

    // Normalize to ISO date string (YYYY-MM-DD)
    event.date = parsedDate.toISOString().split('T')[0];
  }

  // Normalize time format to HH:MM (24-hour format)
  if (event.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (!timeRegex.test(event.time)) {
      // Try to parse common time formats
      const timeMatch = event.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      
      if (!timeMatch) {
        return next(new Error('Invalid time format. Please use HH:MM format.'));
      }

      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const meridiem = timeMatch[3]?.toUpperCase();

      // Convert 12-hour to 24-hour format
      if (meridiem) {
        if (meridiem === 'PM' && hours !== 12) {
          hours += 12;
        } else if (meridiem === 'AM' && hours === 12) {
          hours = 0;
        }
      }

      event.time = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
  }

  next();
});

// Prevent model recompilation in development (Next.js hot reload)
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
