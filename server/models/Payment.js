module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Bookings',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer', 'other'),
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    receiptUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    }
  }, {
    indexes: [
      {
        fields: ['bookingId']
      },
      {
        fields: ['transactionId']
      },
      {
        fields: ['status']
      }
    ]
  });
  
  Payment.associate = (models) => {
    Payment.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking'
    });
  };

  return Payment;
};