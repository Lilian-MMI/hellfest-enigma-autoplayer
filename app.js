const puppeteer = require('puppeteer');

const baseURL = 'https://www.hellfest-enigma.fr/';

const openTo = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({
                headless: false
            });
            const page = await browser.newPage();
            await page.goto(`${baseURL}`, {
                waitUntil: 'networkidle0'
            }).then(() => console.log('Reussi'))
            resolve([page, browser]);
        } catch (err) {
            console.log('Echec de la récupération des données');
            reject(`Erreur ${err}\nTwitch est injoignable ! On régle ce problème de suite (っ °Д °;)っ`);
        }
    })
}

const clickOnEveryItems = async () => {
    const [page, browser] = await openTo();
    const numberIterate = [...Array(10000).keys()];
    let items = [];
    for (let index = 1; index < 51; index++) {
        items.push(`#Stage_sceneMob_bt${index}_zone`);
    }
    return new Promise(async (resolve, reject) => {
        try {

            for await (const i of numberIterate) {
                await page.waitForSelector('#Stage_CTA_intro_Rectangle');
                await page.waitForTimeout(2000);
                await page.click('#Stage_CTA_intro_Rectangle');
                await page.waitForTimeout(12000);
                for await (const item of items) {
                    await page.waitForSelector(item);
                    await page.click(item).then(() => page.waitForTimeout(1000));
                    await page.click('#Stage_indice_indice_bg__Rectangle').then(() => page.waitForTimeout(1000));
                }
                await page.waitForSelector('#Stage_indice_replayBT');
                await page.waitForTimeout(2000);
                await page.click('#Stage_indice_replayBT');
            }

            resolve([items, browser]);
        } catch (err) {
            reject(err);
        }
    })
}

clickOnEveryItems();