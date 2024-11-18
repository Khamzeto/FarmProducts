'use client';

import { useRouter } from 'next/navigation';
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
import { ActionIcon, Container, Group, rem, Text } from '@mantine/core';
import classes from './Footer.module.css';

const data = [
  {
    title: 'About',
    links: [
      { label: 'Features', link: '#' },
      { label: 'Pricing', link: '#' },
      { label: 'Support', link: '#' },
      { label: 'Forums', link: '#' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Contribute', link: '#' },
      { label: 'Media assets', link: '#' },
      { label: 'Changelog', link: '#' },
      { label: 'Releases', link: '#' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Join Discord', link: '#' },
      { label: 'Follow on Twitter', link: '#' },
      { label: 'Email newsletter', link: '#' },
      { label: 'GitHub discussions', link: '#' },
    ],
  },
];

export function FooterLinks() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });
  const router = useRouter();

  const handleClick = () => {
    router.push('/'); // переход на главную страницу
  };

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo} onClick={handleClick} style={{ cursor: 'pointer' }}>
          <div>Ешьте деревенское</div>
        </div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2024.Все права защищены.
        </Text>
      </Container>
    </footer>
  );
}
