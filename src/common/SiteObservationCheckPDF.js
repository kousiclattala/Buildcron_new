import moment from 'moment';

export const SiteObservationCheckPDF = (data) => {
  //   console.log('data from daily report pdf', data);

  var images = data.images;
  var imagesList = [];

  images.map((img) => {
    // console.log('img -->', img);
    let html = `
              <div>
                  <img src=${img.path} alt="site_images" height="800" width="800"/>
                  <br>
              </div>
        `;

    imagesList.push(html);
  });

  return `
              <!DOCTYPE html>
              <html lang="en">
                  <head>
                      <meta charset="UTF-8" />
                      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <title>PDF Report</title>
                      <link rel="stylesheet" href="styles.css" />
                      <style>
                      .address {
                          display: flex;
                          /* justify-content: center; */
                          align-items: center;
                          margin: 5px;
                        }
                      
                      .address-logo {
                          flex: 1;
                          text-transform: uppercase;
                          font-size: 24px;
                          align-self: center;
                          border: 2px solid #eee;
                          height: 150px;
                          margin: 5px;
                          border-radius: 5px;
                        } 
                      
                      .logo {
                          padding-top: 50px;
                          padding-left: 90px;
                        }
                      
                      .address-proj {
                          flex: 2;
                          align-items: flex-start;
                          border: 2px solid #eee;
                          height: 150px;
                          border-radius: 5px;
                          margin: 5px;
                        }
                      
                      .proj-name {
                          display: flex;
                          flex-direction: row;
                          align-items: center;
                          padding-left: 10px;
                        }
                      /* *checklist div classes */
          
                        .checklist {
                            display: flex;
                            justify-content: center;
                            align-content: center;
                            margin: 5px;
                        }
          
                              .checklist-name {
                              flex: 2;
                              align-self: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              height: 70px;
                              margin: 5px;
                              padding-top: 50px;
                              padding-left: 100px;
                              background: #f2f2f2;
                              }
          
                              .dateOfInspection {
                              flex: 1;
                              justify-content: center;
                              align-content: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              margin: 5px;
                              padding-top: 25px;
                              padding-left: 10px;
                              }
          
                              /* *area inspected div classes */
          
                              .areaInsp {
                              display: flex;
                              align-items: center;
                              margin: 5px;
                              }
          
                              .area-location {
                              flex: 2;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              height: 90px;
                              padding-left: 15px;
                              margin: 5px;
                              }
          
                              .area-name {
                              display: flex;
                              flex-direction: row;
                              align-items: center;
                              }
          
                              .area-quant {
                              flex: 1;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              height: 90px;
                              }
          
                              .quant {
                              padding-left: 25px;
                              padding-top: 10px;
                              margin: 5px;
                              }

                              .high {
                                background: red;
                                color: #fff;
                                border-radius: 5px;
                                padding: 10px;
                                
                              }

                              .medium {
                                background: orange;
                                color: #fff;
                                border-radius: 5px;
                                padding: 10px;
                                
                                }

                              .low {
                                background: green;
                                color: #fff;
                                border-radius: 5px;
                                padding: 10px;
                                
                                }
          
                              /* *contractor div classes */
          
                              .contractor {
                              display: flex;
                              align-items: center;
                              margin: 5px;
                              }
          
                              .contractor-name {
                              flex: 1;
                              align-items: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              padding-left: 100px;
                              margin: 5px;
                              }
          
                              .inspector-name {
                              flex: 1;
                              align-items: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              padding-left: 100px;
                              margin: 5px;
                              }
          
                              .cont-name {
                              padding-top: 10px;
                              }
          
                              .checklist-ques {
                                  display: flex;
                                  align-content: start;
                                  border: 2px solid #eee;
                                  border-radius: 5px;
                                  margin-left: 5px;
                                  margin-right: 5px;
                                  margin-bottom: 10px;
                                  height: 100px;
                                  flex-direction: column;
                              }
      
                              .notcomplied-checklist {
                                  display: flex;
                                  align-content: start;
                                  border: 2px solid #eee;
                                  border-radius: 5px;
                                  margin-left: 5px;
                                  margin-right: 5px;
                                  margin-top: 5px;
                                  margin-bottom: 10px;
                                  height: 100px;
                                  flex-direction: column;
                                  background: #f7edeb;
                              }
          
                              .question {
                                  font-size: 20px;
                                  font-weight: 500;
                                  padding-left: 15px;
                                  padding-top: 10px;
                              }
      
          
                              .answer {
                                  padding-top: 20px;
                                  padding-left: 15px;
                              }
          
                              .complied {
                                  background: #10C000;
                                  color: #fff;
                                  border-radius: 5px;
                                  padding: 10px;
                                  margin-left: 10px;
                              }
          
                              .notcomplied {
                                  background: #E14B2B;
                                  color: #fff;
                                  border-radius: 5px;
                                  padding: 10px;
                                  margin-left: 10px;
                              }
          
                      </style>
          
                  </head>
                  <body>
                      <div>
                      <!-- //* Address div -->
                      <div class="address">
                          <div class="address-logo">
                          <div class="logo">
                              <strong>LOGO</strong>
                          </div>
                          </div>
                          <div class="address-proj">
                          <div class="proj-name">
                              <strong>Project Name: </strong>
                              <p style="padding-left: 5px">${
                                data.project.name
                              }</p>
                          </div>
                          <div class="proj-name">
                              <strong>Project Address: </strong>
                              <p style="padding-left: 5px">
                              ${data.project.location}</p>
                          </div>
                          <div class="proj-name">
                              <strong>Document</strong>
                              <p style="padding-left: 5px"># Doc123456789</p>
                          </div>
                          </div>
                      </div>
                      <!-- //*checklist name div -->
                      <div class="checklist">
                          <div class="checklist-name">
                          <strong>Site Observation Report</strong>
                          </div>
                          <div class="dateOfInspection">
                          <strong style="padding-left: 35px">Date of Inspection</strong>
                          <p style="padding-left: 0px">
                          ${moment(Date.now()).format('MMM D YYYY hh:mm A')}
                          </p>
                          </div>
                      </div>
                      <!-- //* Area Inspected div -->
                      <div class="areaInsp">
                          <div class="area-location">
                          <div class="area-name">
                              <strong>Area Being Inspected: </strong>
                              <p style="padding-left: 5px">
                              ${data.siteObservationData.areaInspected}
                              </p>
                          </div>
                          <div class="area-name">
                              <strong>Location: </strong>
                              <p style="padding-left: 5px">Device Location</p>
                          </div>
                          </div>
                          <div class="area-quant">
                          <div class="quant">
                              <strong>Severity Level</strong>
                              <p class=${
                                data.siteObservationData.severityLevel ===
                                'High'
                                  ? 'high'
                                  : data.siteObservationData.severityLevel ===
                                    'Medium'
                                  ? 'medium'
                                  : 'low'
                              }>
                              ${data.siteObservationData.severityLevel}
                            </p>
                          </div>
                          </div>
                      </div>
                      <!-- //* contractor div -->
                      <div class="contractor">
                          <div class="contractor-name">
                          <div class="cont-name">
                              <strong>Contractor Responsible</strong>
                              <p>${
                                data.siteObservationData.contractorResponsible
                              }</p>
                          </div>
                          </div>
                          <div class="inspector-name">
                          <div class="cont-name">
                              <strong>Inspected By</strong>
                              <p>Inspector Name</p>
                          </div>
                          </div>
                      </div>
                      </div>
                      
                      <div class="checklist-ques">
                        <div class="question" >
                            <span style="padding-left: 5px">
                                Observations
                            </span>
                        </div>
                        <div class="answer">
                            <strong>ANS: </strong>
                            <span>${
                              data.siteObservationData.addObservation
                            }</span>
                        </div>
                      </div>

                      <div class="checklist-ques">
                        <div class="question" >
                            
                            <span style="padding-left: 5px">
                                Is the Corrective Action completed to satisfaction ?
                            </span>
                        </div>
                        <div class="answer">
                            <strong>ANS: </strong>
                            <span class=${
                              data.siteObservationChecklist == 'Complied'
                                ? 'complied'
                                : 'notcomplied'
                            }>
                            ${data.siteObservationChecklist}
                            </span>
                            ${
                              data.siteObservationChecklist == 'Not Complied'
                                ? `<span style="padding-left: 5px"> <strong>Note: </strong> ${data.siteObservationNote}</span>`
                                : ''
                            }
                        </div>
                      </div>

                      ${imagesList.join('')}
              `;
};
