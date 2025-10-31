async function fetchVotes() {
	const res = await fetch('/api/votes');
	return res.json();
}

function render(data) {
	const container = document.getElementById('options');
	container.innerHTML = '';
	const total = data.options.reduce((s, o) => s + (o.count || 0), 0) || 1;
	data.options.forEach(opt => {
		const div = document.createElement('div');
		div.className = 'option';
		const left = document.createElement('div');
		left.textContent = opt.label;
		const barWrap = document.createElement('div');
		barWrap.className = 'bar';
		const fill = document.createElement('div');
		fill.className = 'fill';
		const pct = Math.round(((opt.count || 0) / total) * 100);
		fill.style.width = pct + '%';
		barWrap.appendChild(fill);
		const count = document.createElement('div');
		count.className = 'count';
		count.textContent = opt.count || 0;
		const btn = document.createElement('button');
		btn.className = 'btn';
		btn.textContent = 'โหวต';
		btn.onclick = async () => {
			btn.disabled = true;
			await fetch('/api/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ option: opt.id })
			});
			await refresh();
		};
		div.appendChild(left);
		div.appendChild(barWrap);
		div.appendChild(count);
		div.appendChild(btn);
		container.appendChild(div);
	});
}

async function refresh() {
	const data = await fetchVotes();
	render(data);
}

document.getElementById('resetBtn').addEventListener('click', async () => {
	if (!confirm('รีเซ็ตคะแนนทั้งหมด?')) return;
	await fetch('/api/reset', { method: 'POST' });
	await refresh();
});

refresh();
