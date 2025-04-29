module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    photographerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Photographers',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    specificDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    indexes: [
      {
        fields: ['photographerId']
      },
      {
        fields: ['dayOfWeek']
      },
      {
        fields: ['isRecurring']
      }
    ]
  });

  Availability.associate = (models) => {
    Availability.belongsTo(models.Photographer, {
      foreignKey: 'photographerId',
      as: 'photographer'
    });
  };

  return Availability;
};