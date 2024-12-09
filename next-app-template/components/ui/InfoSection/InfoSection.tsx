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
        Доставка фермерских продуктов на дом от сервиса «2beram»
      </Title>
      <Text size="lg" style={{ color: '#555', marginBottom: '30px', lineHeight: 1.6 }}>
        Сервис «2beram» предлагает натуральные фермерские продукты: свежие овощи и фрукты, домашние молочные продукты, ароматные хлебобулочные изделия и аппетитные мясные деликатесы. Мы напрямую сотрудничаем с производителями, чтобы доставить вам продукцию высшего качества без посредников.
      </Text>

      <Title
        order={2}
        style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px', color: '#333' }}
      >
       Почему стоит выбрать натуральные продукты?
      </Title>
      <Text size="md" style={{ color: '#555', marginBottom: '30px', lineHeight: 1.6 }}>
       Фермерские продукты, которые предлагает «2beram», готовятся небольшими партиями на заказ. Производители соблюдают строгие стандарты качества, а перед продажей все товары проходят дополнительный лабораторный контроль. Это гарантирует свежесть и натуральность каждого продукта.

      </Text>

      <Title
        order={2}
        style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px', color: '#333' }}
      >
        Заказать фермерские продукты через «2beram»  
      </Title>
      <Text size="md" style={{ color: '#555', marginBottom: '30px', lineHeight: 1.6 }}>
        Мы доставляем свежие фермерские продукты прямо к вашему порогу. У вас есть возможность оформить индивидуальный заказ или выбрать готовый набор. Доставка осуществляется по Грозному, Аргуну и ближайшим населенным пунктам. Откройте для себя удобство сервиса «2beram» и наслаждайтесь вкусами свежих и натуральных продуктов!
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
