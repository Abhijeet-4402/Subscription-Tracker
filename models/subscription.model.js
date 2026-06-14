import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: [3, 'Subscription name must be at least 3 characters long'],
    },
    price:{
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    currency:{
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'],
        default: 'INR',
        trim: true,
        uppercase: true,
    },
    frequency:{
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly'
    },
    category:{
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'],
        required: [true, 'Category is required'],
    },
    paymentMethod:{
        type: String,
        trim: true,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto', 'other'],
        required: [true, 'Payment method is required'],
    },
    status:{
        type: String,
        enum: ['active', 'canceled', 'expired', 'trial'],
        default: 'active'
    },
    startDate:{
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: value =>  value <= new Date(),
            message: 'Start date cannot be in the future',
        },
        default: Date.now
    },
    renewalDate:{
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date',
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true
    }
}, { timestamps: true });

subscriptionSchema.pre('save', async function(next) {
    //Auto calculate renewal date based on frequency if not provided
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //Auto-Update status based on renewal date
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    // next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;