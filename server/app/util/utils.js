const {
  promises: { writeFile, readFile, stat, mkdir },
} = require('fs');
const csvWrite = require('csv-stringify');
const csvRead = require('csv-parse');
const b = require('bindings');

const rfOn = b('rfOn');
const rfOff = b('rfOff');
const setPower = b('setPower');
const getPower = b('getPower');

const csvFolderLocation = './server/local';
const csvLocation = (channel, unit, type) => `${csvFolderLocation}/unit${unit}_channel${channel}_${type}.csv`;

const writeCsv = async (channel, data, unit, type) => {
  const csv = await new Promise(resolve => csvWrite(data, (err, d) => resolve(d)));
  // if the local folder doesnt exist, make it
  try {
    await stat(csvFolderLocation);
  } catch (e) {
    await mkdir(csvFolderLocation);
  }
  await writeFile(csvLocation(channel, unit, type), csv);
};

const readCsv = async (channel, unit, type) => {
  // check to see if that channel has a default file
  try {
    await stat(csvLocation(channel, unit, type));
  } catch (e) {
    return [];
  }
  const csv = await readFile(csvLocation(channel, unit, type), 'utf8');
  return new Promise(resolve => csvRead(csv, (err, data) => resolve(data)));
};

module.exports = {
  rfOn,
  rfOff,
  setPower,
  getPower,
  writeCsv,
  readCsv,
};
