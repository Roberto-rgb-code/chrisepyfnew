'use client';

import { Icon } from '@iconify/react';
import type { ComponentType } from 'react';

type IconProps = { className?: string };

function icon(id: string): ComponentType<IconProps> {
  return function AnimatedIcon({ className }: IconProps) {
    return <Icon icon={id} className={className} inline />;
  };
}

/** Iconos animados Material Line (line-md) — https://icones.js.org/collection/line-md */

export const Smartphone = icon('line-md:cellphone-twotone');
export const Search = icon('line-md:search-twotone');
export const ShoppingCart = icon('line-md:briefcase-plus-twotone');
export const ShoppingBag = icon('line-md:briefcase-twotone');
export const User = icon('line-md:account');
export const Menu = icon('line-md:menu');
export const Shield = icon('line-md:security-filled');
export const X = icon('line-md:close-small');
export const CheckCircle = icon('line-md:confirm-circle-twotone');
export const AlertCircle = icon('line-md:alert-circle-twotone-loop');
export const Info = icon('line-md:question-circle');
export const Trash2 = icon('line-md:trash');
export const Plus = icon('line-md:plus');
export const Minus = icon('line-md:minus');
export const Truck = icon('line-md:car-light-twotone');
export const Lock = icon('line-md:log-in');
export const HelpCircle = icon('line-md:question-circle-twotone');
export const MessageCircle = icon('line-md:chat-twotone');
export const Phone = icon('line-md:phone-twotone-loop');
export const Mail = icon('line-md:email-twotone');
export const Package = icon('line-md:text-box-twotone');
export const ArrowRight = icon('line-md:arrow-right');
export const Sparkles = icon('line-md:star-pulsating-twotone-loop');
export const Filter = icon('line-md:filter-twotone');
export const Grid = icon('line-md:grid-3-twotone');
export const List = icon('line-md:list-3-twotone');
export const ChevronDown = icon('line-md:chevron-down');
export const ChevronUp = icon('line-md:chevron-up');
export const CreditCard = icon('line-md:clipboard-list-twotone');
export const Calendar = icon('line-md:calendar-twotone');
export const Facebook = icon('line-md:facebook');
export const Instagram = icon('line-md:instagram');
export const Twitter = icon('line-md:twitter-x');
export const Send = icon('line-md:email-alert-twotone');
export const Crosshair = icon('line-md:my-location-loop');
export const Image = icon('line-md:image-twotone');
export const Upload = icon('line-md:upload-loop');
export const DollarSign = icon('line-md:gauge-twotone-loop');
export const Users = icon('line-md:person-add-twotone');
export const TrendingUp = icon('line-md:arrow-up-circle-twotone');
export const Eye = icon('line-md:monitor-twotone');
export const Clock = icon('line-md:watch-loop');
export const XCircle = icon('line-md:close-circle');
export const RefreshCw = icon('line-md:loading-twotone-loop');
export const Download = icon('line-md:download-loop');
export const ImageIcon = icon('line-md:image-twotone');
export const ZoomIn = icon('line-md:monitor-arrow-down-twotone');
export const RotateCw = icon('line-md:rotate-90');
export const FlipHorizontal = icon('line-md:arrows-horizontal-alt');
export const FlipVertical = icon('line-md:arrows-vertical-alt');
export const Move = icon('line-md:my-location-loop');
export const Activity = icon('line-md:speedometer-loop');
export const UserCircle = icon('line-md:account-small');
