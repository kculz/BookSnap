module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Nullable for OAuth users
    },
    role: {
      type: DataTypes.ENUM('client', 'admin', 'super-admin'),
      defaultValue: 'client',
      allowNull: false
    },
    provider: {
      type: DataTypes.ENUM('local', 'google', 'facebook'),
      defaultValue: 'local',
      allowNull: false
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true // Only for OAuth users
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        // For OAuth users, generate a username if not provided
        if (user.provider !== 'local' && !user.username) {
          user.username = user.email.split('@')[0] + Math.floor(Math.random() * 1000);
        }
      }
    },
    indexes: [
      // Index for faster lookups by provider and providerId
      {
        fields: ['provider', 'providerId']
      },
      // Index for email verification lookups
      {
        fields: ['email', 'isVerified']
      }
    ]
  });

  // Instance methods
  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    // Remove sensitive information
    delete values.password;
    delete values.resetPasswordToken;
    delete values.resetPasswordExpires;
    return values;
  };

  User.associate = (models) => {
    User.hasOne(models.Photographer, {
      foreignKey: 'id',
      as: 'photographerProfile'
    });
    User.hasMany(models.Booking, {
      foreignKey: 'clientId',
      as: 'clientBookings'
    });
    User.hasMany(models.Review, {
      foreignKey: 'clientId',
      as: 'reviewsGiven'
    });
  };
  return User;
};