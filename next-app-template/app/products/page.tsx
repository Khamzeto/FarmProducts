'use client';

import { Suspense, useEffect, useState } from 'react';
import Products from '@/components/ui/Products/Products';

export default function ProductPage() {
  return (
    <>
      <Suspense>
        <Products />
      </Suspense>
    </>
  );
}
