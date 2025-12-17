const { expect } = require("chai");
const api = require("../service");

describe("Weather API tests", function () {
  //this.timeout(10000);

  it("Current weather in the city", async () => {
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

});
