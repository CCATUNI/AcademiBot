import * as Jimp from 'jimp';
import * as Path from 'path';
import { v1 } from 'uuid';


export async function createTicket(createTicketDto: { quantity: number, id: string }) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const date = new Date();
  let s = date.getMilliseconds().toString();
  s = s.length === 3 ? s : s.length === 2 ? '0' + s : '00' + s;
  const hour = date.toLocaleString('es-PE', options) + ':' + s;
  let amt = createTicketDto.quantity.toString();
  amt = amt.length === 3 ? amt : amt.length === 2 ? '0' + amt : '00' + amt;
  const image = await Jimp.read('./assets/ticket.png');
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const font2 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  const idString = `U${createTicketDto.id}`;
  const uuid = v1();
  let description1 = 'Ticket generado automáticamente por su gentil donación';
  let description2 =
    'de ' + amt + ' recursos de estudio, muchas gracias por su apoyo.';
  let description3 = uuid;
  const p = Path.join('./public/images', uuid + '.png');
  let description4 = hour;
  return new Promise<{ name: string; path: string }>((resolve, reject) => {
    image
      .print(font, 230, 375, description1)
      .print(font, 220, 415, description2)
      .print(font2, 200, 500, description3)
      .print(font2, 900, 500, description4)
      .rotate(90)
      .print(font, 95, 105, idString)
      .rotate(180)
      .print(font, 95, 105, idString)
      .rotate(90)
      .write(p, err => {
        if (err) return reject(err);
        return resolve({
          name: `${uuid}.png`,
          path: p,
        });
      });
  });
}
