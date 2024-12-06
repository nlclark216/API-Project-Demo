'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
};

const spotImages = [
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-803120435132011058/original/fa4c9781-94f3-42a1-aa75-7a2201bacc87.jpeg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/36f2b408-7656-4ac3-8f66-eb2d064470ad.jpg",
    preview: true
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-650501743979388036/original/901e609b-0433-4fc1-b6c4-668d9dd30fe8.jpeg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-924964707319548986/original/03b335f0-3fc1-438d-a808-97b151de04e8.jpeg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47338321/original/c3b4a217-5bac-45a2-8e75-6a14d76c196f.jpeg",
    preview: true
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47338321/original/480a2f57-60e2-4cf2-9d7a-96a4a47809f1.jpeg",
    preview: true
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-803120435132011058/original/984caa86-6834-4db6-a5d1-c2b6a20bc9fb.jpeg",
    preview: false
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-803120435132011058/original/4adf53b5-f34e-454e-976e-0a05e08323c0.jpeg",
    preview: false
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-803120435132011058/original/77ea9827-7606-4a6a-aade-8c7267f7cc8e.jpeg",
    preview: false
  },
  {
    spotId: 1,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-803120435132011058/original/b85886c5-216a-4059-ad74-0386350a510a.jpeg",
    preview: false
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/36e555d5-730c-4639-b240-f4cdaf4d65d8.jpg",
    preview: false
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-574771929729631839/original/6716409d-8872-457e-87e5-f641dc2aaea3.jpeg",
    preview: false
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/1594d984-e974-4709-8fbe-b485e327c64f.jpg",
    preview: false
  },
  {
    spotId: 2,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6NTc0NzcxOTI5NzI5NjMxODM5/original/e0a06561-c282-4b6e-af60-fd4a80503e44.jpeg",
    preview: false
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-650501743979388036/original/3a5954a7-7038-48c3-b082-e418dcd50243.jpeg",
    preview: false
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-650501743979388036/original/003bd456-8668-4bba-ac32-439ba9ffcf76.jpeg",
    preview: false
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-650501743979388036/original/c3fb6168-7789-4bb4-8e3d-f084030f142b.jpeg",
    preview: false
  },
  {
    spotId: 3,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-650501743979388036/original/20613b8e-c2ee-42e9-9618-bc077b8ee8e4.jpeg",
    preview: false
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-924964707319548986/original/08888153-309e-4cc2-a1ff-7bd6ecf6305d.jpeg",
    preview: false
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-924964707319548986/original/d8291bdb-efa8-4720-8fcd-77d475512c72.jpeg",
    preview: false
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-924964707319548986/original/f5253d71-8d86-462f-831a-67af770280dd.jpeg",
    preview: false
  },
  {
    spotId: 4,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-924964707319548986/original/65789bc7-08b6-4477-b221-a8b804bf6774.jpeg",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47338321/original/9d90e79a-b613-43b9-9345-d97335103b9f.jpeg",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47338321/original/72f2bee4-1b7f-4527-baab-08309dc83a94.jpeg",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47338321/original/3757c1f5-90bc-4d3b-9f56-f7a36b86bfef.jpeg",
    preview: false
  },
  {
    spotId: 5,
    url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-47338321/original/89d301fc-2ee2-4107-81e6-388a6e51460a.jpeg",
    preview: false
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-614647815820366766/original/6feca7fa-8750-472e-a359-b388d9488af3.jpeg",
    preview: false
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-614647815820366766/original/4b007c8b-e3f9-4e6d-8d61-2e17e0cd763a.jpeg",
    preview: false
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-614647815820366766/original/344fb6c9-3a69-4443-8a13-fe07dee57595.jpeg",
    preview: false
  },
  {
    spotId: 6,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-614647815820366766/original/ce94f93c-9b25-4c05-a09a-369bc5419a63.jpeg",
    preview: false
  }
];

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImages, { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    for (const img of spotImages) {
      await SpotImage.destroy({ where: img });
    }
  }
};
