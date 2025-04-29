module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    photographerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Photographers',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'),
      defaultValue: 'pending',
      allowNull: false
    },
    shootType: {
      type: DataTypes.ENUM('portrait', 'wedding', 'commercial', 'event', 'product', 'landscape', 'fashion', 'other'),
      allowNull: false
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'),
      defaultValue: 'unpaid',
      allowNull: false
    }
  }, {
    indexes: [
      {
        fields: ['clientId']
      },
      {
        fields: ['photographerId']
      },
      {
        fields: ['startTime', 'endTime']
      },
      {
        fields: ['status']
      }
    ]
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'clientId',
      as: 'client'
    });
    Booking.belongsTo(models.Photographer, {
      foreignKey: 'photographerId',
      as: 'photographer'
    });
    Booking.hasOne(models.Review, {
      foreignKey: 'bookingId',
      as: 'review'
    });
    Booking.hasMany(models.Payment, {
      foreignKey: 'bookingId',
      as: 'payments'
    });
  };
  return Booking;
};