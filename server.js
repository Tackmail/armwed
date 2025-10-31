const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data', 'votes.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
	// อ่านไฟล์ JSON ของคะแนน
	try {
		return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
	} catch (e) {
		return { options: [] };
	}
}

function writeData(data) {
	fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/votes', (req, res) => {
	res.json(readData());
});

app.post('/api/vote', (req, res) => {
	const optionId = req.body.option;
	if (!optionId) return res.status(400).json({ error: 'option required' });

	const data = readData();
	const opt = data.options.find(o => o.id === optionId || o.label === optionId);
	if (!opt) return res.status(400).json({ error: 'option not found' });

	opt.count = (opt.count || 0) + 1;
	writeData(data);
	res.json({ ok: true, data });
});

app.post('/api/reset', (req, res) => {
	const data = readData();
	data.options.forEach(o => o.count = 0);
	writeData(data);
	res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
