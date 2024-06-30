<h1>Restaurants</h1>
This Restaurants-List can share restaurants informatiuon for you.

<h2>Features</h2>
<li>Display all restaurants in the list</li>
<li>Search restaurants by name or category</li>
<li>Add new restaurant that you like</li>
<li>Check the restaurant information</li>
<li>Edit restaurant information</li>
<li>Delete restaurant information</li>

<h2>Environment requirements</h2>

<li>Node.js v18</li>
<li>MySQL server v8</li>

<h2>Installation</h2>

git clone https:

```
git clone https://github.com/Yuii24/restaurant
```
<br>
2. Move to the Restaurants directory

```
cd restaurants
```
<br>

3. Restore the dependencies

```
npm install
```

<br />

4. Create example environment configs

```
npm run model:create
```

<br />

5. Launch Mysql Server

Launch your mysql server, and edit environment config files in folder "models".<br />

<br />

6. Create a new database and seed test data.

```
npm run db:create
npm run seed
```

<br />

7. Launch the application

Run app in development mode

```
npm run dev
```

or

Run app in production mode

```
npm run build
npm run start
```
