import { expect } from "chai";
import api from "../service.js";
import { locationKeys, currentKeys } from "../consts.js";
import { errorMessages } from "../errorMessages.js";


describe("Positive Weather API tests", function () {
  //this.timeout(10000);

  it("Current weather in the city and expected fields", async () => {
    const result = await api.get("/current.json", { q: "Istanbul" });
    expect(result.status).to.equal(200);
    expect(result.data).to.have.property("location");
    expect(result.data).to.have.property("current");
    expect(result.data.location.country).to.equal("Turkey");
    expect(result.data.location.tz_id).to.equal("Europe/Istanbul");
    expect(result.data.location).to.include.all.keys(locationKeys);
    expect(result.data.current).to.include.keys(currentKeys);

  });

  it("US Zipcode as a q param", async () => {
    const result = await api.get("/current.json", { q: "10001" });
    expect(result.status).to.equal(200);
    expect(result.data).to.have.property("location");
    expect(result.data).to.have.property("current");
    expect(result.data.location.country).to.equal("USA");
    expect(result.data.location.tz_id).to.equal("America/New_York");
    expect(result.data.location.name).to.equal("New York");
    expect(result.data.location.region).to.equal("New York");

  });

  it("UK Postcode as a q param", async () => {
    const result = await api.get("/current.json", { q: "M1" });
    expect(result.status).to.equal(200);
    expect(result.data).to.have.property("location");
    expect(result.data).to.have.property("current");
    expect(result.data.location.country).to.equal("UK");
    expect(result.data.location.tz_id).to.equal("Europe/London");
    expect(result.data.location.name).to.equal("Manchester");
    expect(result.data.location.region).to.equal("Lancashire");
  });

  it("Canada Postalcode as a q param", async () => {
    const result = await api.get("/current.json", { q: "H0H 0H0" });
    expect(result.status).to.equal(200);
    expect(result.data.location.name).to.equal("Reserved (Santa Claus)");
    expect(result.data.location.country).to.equal("Canada");
    expect(result.data.location.tz_id).to.equal("Arctic/Longyearbyen");
    expect(result.data.location.region).to.equal("");
    expect(result.data).to.have.property("location");
    expect(result.data).to.have.property("current");
  });


  it("Latitude/Longitude as a q param", async () => {
    const result = await api.get("/current.json", { q: "52.517,13.4" });
    expect(result.status).to.equal(200);
    expect(result.data.location.name).to.equal("Berlin");
    expect(result.data.location.country).to.equal("Germany");
    expect(result.data.location.tz_id).to.equal("Europe/Berlin");
    expect(result.data.location.region).to.equal("Berlin");
    expect(result.data).to.have.property("location");
    expect(result.data).to.have.property("current");
  });


});


describe("Negative Weather API tests", function () {  
  
  it("Param q is required", async() => {
    try {
      await api.get("/current.json");
      throw new Error(errorMessages.emptyParamQ);
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property("error");
      expect(error.response.data.error.code).to.equal(1003)
    }
  })


  it("Param null is incorrect", async() => {
    try {
      await api.get("/current.json", {q: null});
      throw new Error(errorMessages.nullParamQ);
    } catch(error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property("error");
      expect(error.response.data.error.code).to.equal(1003);
    } 
  })

  it("Param undefined is incorrect", async() => {
    try{
      await api.get("/current.json", { q: undefined });
      throw new Error(errorMessages.undefinedParamQ);
    } catch(error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1003);
    }
  })

  it("Blank string is incorrect param", async() => {
    try{
      await api.get("/current.json", {q: ""});
      throw new Error(errorMessages.blankParamQ)
    } catch(error){
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property("error");
      expect(error.response.data.error.code).to.equal(1003);
    }
  })

  it("Сharacters are incorrect params", async() => {
    try{
      await api.get("/current.json", {q: "` ~ @ #"});
      throw new Error(errorMessages.invalidCharsQ)
    } catch(error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1006);
    }
  })

  it("Random text is incorrect param", async() => {
    try{
      await api.get("/current.json", { q : "firebase"});
      throw new Error(errorMessages.randomTextQ)
    } catch(error) {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1006);
    }
  })


});
