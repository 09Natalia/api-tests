const { expect } = require("chai");
const api = require("../service");

describe("Positive Weather API tests", function () {
  //this.timeout(10000);

  it("Current weather in the city and expected fields", async () => {
    const result = await api.get("/current.json", { q: "Istanbul" });
    expect(result.status).to.equal(200);
    expect(result.data).to.have.property("location");
    expect(result.data).to.have.property("current");
    expect(result.data.location.country).to.equal("Turkey");
    expect(result.data.location.tz_id).to.equal("Europe/Istanbul");
    expect(result.data.location).to.include.all.keys([
      "name",
      "region",
      "country",
      "lat",
      "lon",
      "tz_id",
      "localtime"
    ]);
    expect(result.data.current).to.include.keys([
      "last_updated_epoch",
      "last_updated",
      "temp_c",
      "temp_f",
      "is_day",
      "feelslike_c",
      "feelslike_f",
      "humidity",
    ]);

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
  
  it("q param is required", () => {
    return api.get("/current.json")
      .then(() => {
        throw new Error("Error! q param is required");})
      .catch(emptyError => {
        expect(emptyError.response.status).to.equal(400);
        expect(emptyError.response.data).to.have.property("error");
        expect(emptyError.response.data.error.code).to.equal(1003);
      });
  })

  it("null is incorrect param", () => {
    return api.get("/current.json", { q: null })
      .then(() => {
        throw new Error("Error! null is invalid param");})
      .catch(error => {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1003);
      });
  })

  it("undefined is incorrect param", () => {
    return api.get("/current.json", { q: undefined })
      .then(() => {
        throw new Error("Expected error for undefined q");})
      .catch(error => {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1003);
      });
  })

  it("Blank string is incorrect param",() => {
    return api.get("/current.json", { q : ""})
      .then(() => {
        throw new Error("Erorr! Blank string is incorrect param");})
      .catch(error => {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1003);
      })
  })

  it("Сharacters is incorrect param",() => {
    return api.get("/current.json", { q : "` ~ @ #"})
      .then(() => {
        throw new Error("Erorr! characters is incorrect param");})
      .catch(error => {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1006);
      })
  })

  it("Random text is incorrect param",() => {
    return api.get("/current.json", { q : "firebase"})
      .then(() => {
        throw new Error("Erorr! characters is incorrect param");})
      .catch(error => {
        expect(error.response.status).to.equal(400);
        expect(error.response.data).to.have.property("error");
        expect(error.response.data.error.code).to.equal(1006);
      })
  })



});
