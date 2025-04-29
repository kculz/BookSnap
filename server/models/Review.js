module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    indexes: [
      {
        fields: ['photographerId']
      },
      {
        fields: ['bookingId'],
        unique: true
      }
    ]
  });
  Review.associate = (models) => {
    Review.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking'
    });
    Review.belongsTo(models.User, {
      foreignKey: 'clientId',
      as: 'client'
    });
    Review.belongsTo(models.Photographer, {
      foreignKey: 'photographerId',
      as: 'photographer'
    });
  };
  return Review;
};