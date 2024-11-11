'use client';

import { Anchor, Container, Text, Title } from '@mantine/core';

export function InfoSection() {
  return (
    <Container
      size="lg"
      mt="40"
      mb="40"
      style={{ backgroundColor: '#f7f7f7', padding: '40px', borderRadius: '24px' }}
    >
      <Title
        order={1}
        style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '20px', color: '#333' }}
      >
        Доставка продуктов на дом от фермеров
      </Title>
      <Text size="lg" style={{ color: '#555', marginBottom: '30px', lineHeight: 1.6 }}>
        Фермерские продукты из интернет-магазина «Ешь Деревенское» — это сочные фрукты и овощи,
        пышные булочки из семейных пекарен, жирные сливки из молока домашних коров и ароматные
        колбасы. Мы сократили путь между производителями и покупателями, чтобы на вашем столе были
        только самые свежие продукты.
      </Text>

      <Title
        order={2}
        style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px', color: '#333' }}
      >
        Почему натуральные продукты предпочтительны
      </Title>
      <Text size="md" style={{ color: '#555', marginBottom: '30px', lineHeight: 1.6 }}>
        Продукты, которые производят наши фермеры, не относятся к массовому товару. Производители
        готовят под заказ в небольших объемах, но при этом соблюдают все стандарты качества.
        Дополнительный лабораторный контроль продукция проходит перед поступлением на продажу.
      </Text>

      <Title
        order={2}
        style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px', color: '#333' }}
      >
        Заказ фермерских продуктов в «Ешь Деревенское»
      </Title>
      <Text size="md" style={{ color: '#555', marginBottom: '30px', lineHeight: 1.6 }}>
        Мы предлагаем продукты с фермы с доставкой на дом — из деревни они сразу попадают к вашему
        столу. Вы можете оформить индивидуальный заказ на сайте или приобрести готовый набор.
        Доставка осуществляется по Москве и Санкт-Петербургу +40 км от МКАД/КАД, а также Дмитрову и
        Твери.
      </Text>

      <Anchor
        href="#"
        style={{ fontSize: '1rem', fontWeight: 500, color: '#0073e6', textDecoration: 'underline' }}
      >
        Подробнее
      </Anchor>
    </Container>
  );
}

export default InfoSection;
