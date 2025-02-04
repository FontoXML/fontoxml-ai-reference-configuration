// These are the stubbed bits of "generated content"
const ipsums = [
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec gravida lobortis pretium. Nulla a tincidunt eros. Etiam venenatis hendrerit magna in aliquet. Aenean sagittis at augue ut iaculis. Pellentesque aliquam rutrum massa at ultricies. Aliquam nec ex id est varius pharetra vel nec diam. Nunc condimentum libero id aliquet mollis. Integer nec quam ex. Donec sem massa, rhoncus vel consequat a, mollis vitae arcu.',
	'Curabitur vitae mauris non mauris euismod dapibus quis feugiat lectus. Cras efficitur tincidunt erat, eget placerat justo interdum in. Phasellus venenatis felis at purus commodo, auctor tempus nibh commodo. Ut ut dignissim sem. Aliquam sit amet consectetur erat. Phasellus molestie iaculis lectus ullamcorper maximus. Nunc faucibus ut ante eget malesuada. Etiam turpis felis, gravida ac vulputate sit amet, lacinia eget elit.',
	'Cras tincidunt quam vitae tellus luctus sagittis. Aliquam ornare tellus in elit imperdiet, eget commodo diam varius. Donec et ultricies dolor, non scelerisque felis. Morbi interdum, ex nec egestas vulputate, lorem velit condimentum ligula, nec rhoncus odio ipsum in urna. Phasellus elementum gravida lacinia. Nulla ac laoreet magna, non tincidunt est. Aliquam vulputate, ligula vel tempus consequat, libero lacus mollis purus, at eleifend risus ex nec dui. Nunc bibendum purus sit amet sem faucibus convallis. Vestibulum tincidunt quam vel velit vulputate, nec feugiat sapien cursus. Nullam at interdum mi, nec vestibulum arcu. Vestibulum faucibus vitae ipsum et tristique. Vivamus nec orci convallis, luctus turpis id, maximus neque. Curabitur ac pulvinar odio. In blandit elementum rhoncus. Aliquam eros elit, placerat vitae ligula vitae, bibendum congue ipsum. Praesent tempus euismod arcu.',
	'In lobortis eros nibh, a efficitur orci placerat quis. Integer faucibus condimentum mauris, commodo elementum magna venenatis eget. Pellentesque vel tempus dui. Vivamus in scelerisque tortor. Maecenas nec elit nisl. Etiam eu erat ac justo rutrum sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis ligula diam, interdum eleifend nisi iaculis consequat. Mauris facilisis lectus fermentum pulvinar dictum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec gravida metus in ante dictum consectetur. Pellentesque ultricies nunc vestibulum leo egestas, vitae iaculis nulla tempus. In hac habitasse platea dictumst. In hac habitasse platea dictumst. Duis ex nisi, malesuada porttitor felis at, pulvinar bibendum ipsum.',
	'Fusce tempor non dolor vitae efficitur. Sed cursus vel tortor vitae iaculis. Nullam dolor sapien, accumsan eu suscipit ac, semper dictum felis. Nullam at auctor leo. Curabitur tristique rutrum tincidunt. Cras commodo lacus gravida est imperdiet dictum. Vestibulum consequat auctor congue. Maecenas congue, nisl ac pellentesque fringilla, erat erat aliquet turpis, at ultrices tortor urna ut neque. Donec libero ipsum, congue nec mollis nec, pretium non dolor. Donec ultrices nunc ac justo aliquam accumsan. Maecenas in elit odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pharetra, sapien id fermentum faucibus, velit turpis venenatis nunc, sit amet congue ligula ipsum vel dui. Curabitur pellentesque dictum neque, nec venenatis enim pulvinar a. Fusce et efficitur felis. In ut tincidunt dolor, ut dignissim lorem.',
];

module.exports = (router, _config) => {
	router
		.route('/connectors/cms/standard/ai-assistant/generate')
		.post(async (req, res) => {
			const context = req.body && req.body.context;

			// Take some time to simulate the time an AI takes to generate a response
			await new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 500);
			});

			if (!context) {
				return res
					.status(400)
					.send(new Error('Malformed request, missing context'));
			}

			if (!context.editSessionToken) {
				return res
					.status(400)
					.send(new Error('Malformed request, missing information'));
			}

			// HTTP 400 error stub
			if (req.body.prompt === 'http-400') {
				return res.status(400).send(new Error('Bad Request'));
			}

			// HTTP 401 error stub
			if (req.body.prompt === 'http-401') {
				return res.status(401).send(new Error('Unauthorized'));
			}

			// HTTP 403 error stub
			if (req.body.prompt === 'http-403') {
				return res.status(403).send(new Error('Forbidden'));
			}

			// HTTP 500 error stub
			if (req.body.prompt === 'http-500') {
				return res.status(500).send(new Error('Server Error'));
			}

			res.setHeader('Content-Type', 'application/json');

			// Stub for returning only generated content
			if (req.body.prompt === 'only-content') {
				return res.status(200).json({
					generatedContent:
						'This content is generated and the message is empty',
					message: null,
				});
			}

			// Stub for returning only a message from the AI
			if (req.body.prompt === 'only-message') {
				return res.status(200).json({
					generatedContent: null,
					message: 'This content is a message and not generated',
				});
			}

			return res.status(200).json({
				generatedContent:
					ipsums[Math.floor(Math.random() * ipsums.length)],
				message:
					'This content has been generated by the Lorem Ipsum generator.',
			});
		});

	return router;
};
