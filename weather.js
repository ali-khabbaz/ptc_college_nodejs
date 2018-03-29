'use strict';
const request = require('request'),
    weatherAPIKey = '____',

    /**
     * @description دریافت آب و هوا از api
     * @param {String} city
     */
    getWeather = async (city) => {
        try {
            const body = await getLocationId(city);
            return await getCurrentCondition(body);
        } catch (err) {
            return null;
        }
    },
    /**
     * @description دریافت شناسه شهر
     * @param {String} city
     */
    getLocationId = async (city) => {
        return new Promise((resolve, reject) => {
            city = encodeURIComponent(city);

            const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${weatherAPIKey}&q=${city}&language=fa-ir`;

            request(url, requestDone);

            function requestDone(error, response, body) {
                if (error) {
                    return reject(error);
                }
                body = JSON.parse(body)[0];

                if (!body) {
                    return reject('city not found');
                }
                return resolve({
                    key: body.Key,
                    city: body.LocalizedName,
                    province: body.AdministrativeArea.LocalizedName
                });
            }
        });
    },
    /**
     * @description دریافت آب و هوا از api
     * @param {Object} data
     */
    getCurrentCondition = async (data) => {
        return new Promise((resolve, reject) => {

            const url = `http://dataservice.accuweather.com/currentconditions/v1/${data.key}?apikey=${weatherAPIKey}&language=fa-ir&details=false`;

            request(url, requestDone);

            function requestDone(error, response, body) {
                if (error) {
                    return reject(error);
                }
                body = JSON.parse(body)[0];

                if (!body) {
                    return reject('error');
                }

                data.weatherText = body.WeatherText;
                data.temperature = body.Temperature.Metric.Value;
                return resolve(data);
            }
        });
    };


module.exports = {
    getWeather,
    getLocationId,
    getCurrentCondition
};