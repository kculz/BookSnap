module.exports = (sequelize, DataTypes) => {
  const Portfolio = sequelize.define('Portfolio', {
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('portrait', 'wedding', 'commercial', 'event', 'product', 'landscape', 'fashion', 'other'),
      allowNull: false
    },
    isFeatured: {
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
        fields: ['category']
      },
      {
        fields: ['isFeatured']
      }
    ]
  });
  Portfolio.associate = (models) => {
    Portfolio.belongsTo(models.Photographer, {
      foreignKey: 'photographerId',
      as: 'photographer'
    });
  };

  return Portfolio;
};