const form = document.getElementById('image_form');
const result = document.getElementById('results');
const result_container = document.querySelector('.results.hidden');

const get_food_list = async (name) => {
    return new Promise(async (resolve, reject) => {
        await fetch(`https://api.nal.usda.gov/fdc/v1/search?api_key=ayPNBibUsKeQO6K6ax0KZfQcAPQirqqnLu5jNvkO&generalSearchInput=${name}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
    });
}

const get_food_nutrients = async (food_id) => {
    return new Promise(async (resolve, reject) => {
        await fetch(`https://api.nal.usda.gov/fdc/v1/${food_id}?api_key=ayPNBibUsKeQO6K6ax0KZfQcAPQirqqnLu5jNvkO`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
    });
}

const get_food_nutrient = async (food_list) => {
    return new Promise(async (resolve, reject) => {
        for (const food of food_list.foods) {
            const food_data = await get_food_nutrients(food.fdcId);
            if (food_data.foodNutrients.length > 1) {
                resolve(food_data);
                break;
            }
        }
        reject({ status: "failed", message: "no data found" });
    });
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const loader = document.querySelector('.loader');
    loader.style.display = "block";
    loader.style.zIndex = "99";
    await fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    }).then(response => response.json())
        .then(async data => {
            // console.log(data);
            // window.data = data;
            const food_list = await get_food_list(data.image_results.images[0].classifiers[0].classes[0].class);
            // console.log(food_list);
            const food_nutrients = await get_food_nutrient(food_list);
            let table_html = `<div class="table100 ver1 m-b-110">
                                <div class="table100-head">
                                <table>
                                    <thead>
                                        <tr class="row100 head">
                                            <th class="cell100 column1">Name</th>
                                            <th class="cell100 column2">Quantity</th>
                                            <th class="cell100 column3">Unit</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table100-body js-pscroll">
                                <table>
                                    <tbody>`
            food_nutrients.foodNutrients.forEach(nutrient => {
                table_html += `<tr class="row100 body">
                <td class="cell100 column1">${nutrient.nutrient.name}</td>
                <td class="cell100 column2">${nutrient.amount.toFixed(2)}</td>
                <td class="cell100 column3">${nutrient.nutrient.unitName}</td>
            </tr>`
            });
            table_html += `</tbody>
            </table>
        </div>
  </div>`
            document.getElementById("result_name").innerHTML = data.image_results.images[0].classifiers[0].classes[0].class.toUpperCase();
            result.innerHTML = table_html;
        })
        .catch(error => {
            result.innerHTML = error;
        })
        loader.style.display = "none";
        loader.style.zIndex = "-99";
    result_container.style.display = 'block';
});