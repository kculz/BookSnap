module.exports = (sequelize, DataTypes) => {
  const Photographer = sequelize.define('Photographer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    specialization: {
      type: DataTypes.ENUM('portrait', 'wedding', 'commercial', 'event', 'product', 'landscape', 'fashion', 'other'),
      allowNull: false,
      defaultValue: 'other'
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    equipment: {
      type: DataTypes.JSON,
      allowNull: true
    },
    portfolioLink: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    indexes: [
      {
        fields: ['specialization']
      },
      {
        fields: ['isAvailable']
      },
      {
        fields: ['rating']
      }
    ]
  });
  
  Photographer.associate = (models) => {
    Photographer.belongsTo(models.User, {
      foreignKey: 'id',
      as: 'userDetails'
    });
    Photographer.hasMany(models.Booking, {
      foreignKey: 'photographerId',
      as: 'bookings'
    });
    Photographer.hasMany(models.Availability, {
      foreignKey: 'photographerId',
      as: 'availabilities'
    });
    Photographer.hasMany(models.Portfolio, {
      foreignKey: 'photographerId',
      as: 'portfolio'
    });
    Photographer.hasMany(models.Review, {
      foreignKey: 'photographerId',
      as: 'reviews'
    });
  };
  
  return Photographer;
};