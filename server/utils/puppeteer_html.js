export const HTML = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Poem</title>
    <link rel="stylesheet" href="./public/stylesheets/style.css">
    <link rel="stylesheet" href="./public/stylesheets/card.css">
</head>

<body>
    <div class="card__positioner">
        <div id="capture" class="card__wrapper">
            <div class="card__container">
                <div class="color__container">
                    <div class="color__name">
                        <span></span>
                    </div>
                    <div class="color__hex">
                        <span></span>
                    </div>
                </div>

                <div class="poem__container">
                    <div class="poem__inner">
                        <span class="poem__text">
                        </span>
                    </div>
                </div>

                <div class="title__container">
                    <div class="title__text">
                        <span>DELPHI</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
`;

export const style = `
body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
}

.card__positioner {
    display: grid;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-content: center;
}

.card__wrapper {
	aspect-ratio: 4 / 6;
	width: 400px;
}

.card__container {
	position: relative;
	width: 100%;
	height: 100%;
}

.poem__container {
	display: grid;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
	text-align: center;
	aspect-ratio: 1 / 1;
	width: 70%;
	border-radius: 50%;
	background-color: white;
	align-content: center;
	overflow: hidden;
	padding: 20px;
	display: flex;
	align-items: center;
}

.poem__inner {
	position: relative;
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
}

.poem__inner span {
	max-height: 70%;
	overflow: hidden;
	font-family: "Georgia", serif;
	font-size: 12px;
	line-height: 1.6;
	text-align: center;
	color: #333;
	max-width: 84%;
	margin-left: auto;
	margin-right: auto;
	box-sizing: border-box;
}

.title__container {
	position: absolute;
	bottom: 0;
	width: 100%;
	max-height: 18%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	margin-bottom: 20px;
}

.title__text {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: left;
	margin: 0 5px;
	text-transform: uppercase;
}

.title__text span {
	font-size: 70px;
	font-weight: bold;
}

.tud_logo__container {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 40%;
	box-sizing: border-box;
}

.color__container {
	width: 100%;
	height: 20%;
	padding: 40px 10px 10px 10px;
	box-sizing: border-box;
	text-align: center;
}

.color__name {
	margin-bottom: 5px;
}

.color__name span {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 30px;
}

.color__hex span {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: bold;
}
`;