import React from 'react';
import {
  EmojiDialog,
  EmojiGrandlist,
  EmojiCategoryList,
  EmojiListItem,
} from './styles';

class EmojiPicker extends React.Component {
  onChange = emoji => {
    this.props.onChange(emoji);
  };

  getEmojis = () => {
    const emojis = [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '😂',
      '🤣',
      '😊',
      '😇',
      '🙂',
      '🙃',
      '😉',
      '😌',
      '😍',
      '😘',
      '😗',
      '😙',
      '😚',
      '😋',
      '😜',
      '😝',
      '😛',
      '🤑',
      '🤗',
      '🤓',
      '😎',
      '🤡',
      '🤠',
      '😏',
      '😒',
      '😞',
      '😔',
      '😟',
      '😕',
      '🙁',
      '😣',
      '😖',
      '😫',
      '😩',
      '😤',
      '😠',
      '😡',
      '😶',
      '😐',
      '😑',
      '😯',
      '😦',
      '😧',
      '😮',
      '😲',
      '😵',
      '😳',
      '😱',
      '😨',
      '😰',
      '😢',
      '😥',
      '🤤',
      '😭',
      '😓',
      '😪',
      '😴',
      '🙄',
      '🤔',
      '🤥',
      '😬',
      '🤐',
      '🤢',
      '🤧',
      '😷',
      '🤒',
      '🤕',
      '😈',
      '👿',
      '👹',
      '👺',
      '💩',
      '👻',
      '💀',
      '👽',
      '👾',
      '🤖',
      '🎃',
      '😺',
      '😸',
      '😹',
      '😻',
      '😼',
      '😽',
      '🙀',
      '😿',
      '😾',
      '👐',
      '🙌',
      '👏',
      '🙏',
      '🤝',
      '👍',
      '👎',
      '👊',
      '✊',
      '🤛',
      '🤜',
      '🤞',
      '🤘',
      '👌',
      '👈',
      '👉',
      '👆',
      '👇',
      '✋',
      '🤚',
      '🖐',
      '🖖',
      '👋',
      '🤙',
      '💪',
      '🖕',
      '🤳',
      '💅',
      '🖖',
      '💄',
      '💋',
      '👄',
      '👅',
      '👂',
      '👃',
      '👁',
      '👀',
      '🗣',
      '👤',
      '👥',
      '👶',
      '👦',
      '👧',
      '👨',
      '👩',
      '👱‍',
      '👱',
      '👴',
      '👵',
      '👲',
      '👳',
      '👳',
      '👮',
      '👷',
      '💂',
      '🕵',
      '👩',
      '👨',
      '👩',
      '👨',
      '👩',
      '👨',
      '🤶',
      '🎅',
      '👸',
      '🤴',
      '👰',
      '🤵',
      '👼',
      '🤰',
      '🙇',
      '🙇',
      '💁',
      '🙅',
      '🙆',
      '🙋',
      '🤦',
      '🤷',
      '🙎',
      '💇',
      '💆',
      '🕴',
      '💃',
      '🕺',
      '👯',
      '🚶',
      '🏃',
      '👫',
      '👭',
      '👬',
      '💑',
      '👪',
      '👨‍👩‍👧',
      '👨‍👩‍👧‍👦',
      '👨‍👩‍👦‍👦',
      '👨‍👩‍👧‍👧',
      '👩‍👩‍👦',
      '👩‍👩‍👧',
      '👩‍👩‍👧‍👦',
      '👩‍👩‍👦‍👦',
      '👩‍👩‍👧‍👧',
      '👨‍👨‍👦',
      '👨‍👨‍👧',
      '👨‍👨‍👧‍👦',
      '👨‍👨‍👦‍👦',
      '👨‍👨‍👧‍👧',
      '👩‍👦',
      '👩‍👧',
      '👩‍👧‍👦',
      '👩‍👦‍👦',
      '👩‍👧‍👧',
      '👨‍👦',
      '👨‍👧',
      '👨‍👧‍👦',
      '👨‍👦‍👦',
      '👨‍👧‍👧',
      '👚',
      '👕',
      '👖',
      '👔',
      '👗',
      '👙',
      '👘',
      '👠',
      '👡',
      '👢',
      '👞',
      '👟',
      '👒',
      '🎩',
      '🎓',
      '👑',
      '⛑',
      '🎒',
      '👝',
      '👛',
      '👜',
      '💼',
      '👓',
      '🕶',
      '🌂',
      '🐶',
      '🐱',
      '🐭',
      '🐹',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐨',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐽',
      '🐸',
      '🐵',
      '🙊',
      '🙉',
      '🙊',
      '🐒',
      '🐔',
      '🐧',
      '🐦',
      '🐤',
      '🐣',
      '🐥',
      '🦆',
      '🦅',
      '🦉',
      '🦇',
      '🐺',
      '🐗',
      '🐴',
      '🦄',
      '🐝',
      '🐛',
      '🦋',
      '🐌',
      '🐚',
      '🐞',
      '🐜',
      '🕷',
      '🕸',
      '🐢',
      '🐍',
      '🦎',
      '🦂',
      '🦀',
      '🦑',
      '🐙',
      '🦐',
      '🐠',
      '🐟',
      '🐡',
      '🐬',
      '🦈',
      '🐳',
      '🐋',
      '🐊',
      '🐆',
      '🐅',
      '🐃',
      '🐂',
      '🐄',
      '🦌',
      '🐪',
      '🐫',
      '🐘',
      '🦏',
      '🦍',
      '🐎',
      '🐖',
      '🐐',
      '🐏',
      '🐑',
      '🐕',
      '🐩',
      '🐈',
      '🐓',
      '🦃',
      '🕊',
      '🐇',
      '🐁',
      '🐀',
      '🐿',
      '🐾',
      '🐉',
      '🐲',
      '🌵',
      '🎄',
      '🌲',
      '🌳',
      '🌴',
      '🌱',
      '🌿',
      '☘️',
      '🍀',
      '🎍',
      '🎋',
      '🍃',
      '🍂',
      '🍁',
      '🍄',
      '🌾',
      '💐',
      '🌷',
      '🌹',
      '🥀',
      '🌻',
      '🌼',
      '🌸',
      '🌺',
      '🌎',
      '🌍',
      '🌏',
      '🌕',
      '🌖',
      '🌗',
      '🌘',
      '🌑',
      '🌒',
      '🌓',
      '🌔',
      '🌚',
      '🌝',
      '🌞',
      '🌛',
      '🌜',
      '🌙',
      '💫',
      '⭐️',
      '🌟',
      '✨',
      '⚡️',
      '🔥',
      '💥',
      '☄️',
      '☀️',
      '🌤',
      '⛅️',
      '🌥',
      '🌦',
      '🌈',
      '☁️',
      '🌧',
      '⛈',
      '🌩',
      '🌨',
      '☃️',
      '⛄️',
      '❄️',
      '🌬',
      '💨',
      '🌪',
      '🌫',
      '🌊',
      '💧',
      '💦',
      '☔️',
      '🍏',
      '🍎',
      '🍐',
      '🍊',
      '🍋',
      '🍌',
      '🍉',
      '🍇',
      '🍓',
      '🍈',
      '🍒',
      '🍑',
      '🍍',
      '🥝',
      '🥑',
      '🍅',
      '🍆',
      '🥒',
      '🥕',
      '🌽',
      '🌶',
      '🥔',
      '🍠',
      '🌰',
      '🥜',
      '🍯',
      '🥐',
      '🍞',
      '🥖',
      '🧀',
      '🥚',
      '🍳',
      '🥓',
      '🥞',
      '🍤',
      '🍗',
      '🍖',
      '🍕',
      '🌭',
      '🍔',
      '🍟',
      '🥙',
      '🌮',
      '🌯',
      '🥗',
      '🥘',
      '🍝',
      '🍜',
      '🍲',
      '🍥',
      '🍣',
      '🍱',
      '🍛',
      '🍚',
      '🍙',
      '🍘',
      '🍢',
      '🍡',
      '🍧',
      '🍨',
      '🍦',
      '🍰',
      '🎂',
      '🍮',
      '🍭',
      '🍬',
      '🍫',
      '🍿',
      '🍩',
      '🍪',
      '🥛',
      '🍼',
      '☕️',
      '🍵',
      '🍶',
      '🍺',
      '🍻',
      '🥂',
      '🍷',
      '🥃',
      '🍸',
      '🍹',
      '🍾',
      '🥄',
      '🍴',
      '🍽',
      '⚽️',
      '🏀',
      '🏈',
      '⚾️',
      '🎾',
      '🏐',
      '🏉',
      '🎱',
      '🏓',
      '🏸',
      '🥅',
      '🏒',
      '🏑',
      '🏏',
      '⛳️',
      '🏹',
      '🎣',
      '🥊',
      '🥋',
      '⛸',
      '🎿',
      '⛷',
      '🏂',
      '🏋️',
      '🏋️',
      '🤺',
      '🤼',
      '🤼‍',
      '🤸',
      '🤸‍',
      '⛹️',
      '⛹️',
      '🤾',
      '🤾‍',
      '🏌️',
      '🏌️',
      '🏄',
      '🏄',
      '🏊',
      '🏊',
      '🤽',
      '🤽‍',
      '🚣',
      '🚣',
      '🏇',
      '🚴',
      '🚴',
      '🚵',
      '🚵',
      '🎽',
      '🏅',
      '🎖',
      '🥇',
      '🥈',
      '🥉',
      '🏆',
      '🏵',
      '🎗',
      '🎫',
      '🎟',
      '🎪',
      '🤹',
      '🤹‍',
      '🎭',
      '🎨',
      '🎬',
      '🎤',
      '🎧',
      '🎼',
      '🎹',
      '🥁',
      '🎷',
      '🎺',
      '🎸',
      '🎻',
      '🎲',
      '🎯',
      '🎳',
      '🎮',
      '🎰',
      '🚗',
      '🚕',
      '🚙',
      '🚌',
      '🚎',
      '🏎',
      '🚓',
      '🚑',
      '🚒',
      '🚐',
      '🚚',
      '🚛',
      '🚜',
      '🛴',
      '🚲',
      '🛵',
      '🏍',
      '🚨',
      '🚔',
      '🚍',
      '🚘',
      '🚖',
      '🚡',
      '🚠',
      '🚟',
      '🚃',
      '🚋',
      '🚞',
      '🚝',
      '🚄',
      '🚅',
      '🚈',
      '🚂',
      '🚆',
      '🚇',
      '🚊',
      '🚉',
      '🚁',
      '🛩',
      '✈️',
      '🛫',
      '🛬',
      '🚀',
      '🛰',
      '💺',
      '🛶',
      '⛵️',
      '🛥',
      '🚤',
      '🛳',
      '⛴',
      '🚢',
      '⚓️',
      '🚧',
      '⛽️',
      '🚏',
      '🚦',
      '🚥',
      '🗺',
      '🗿',
      '🗽',
      '⛲️',
      '🗼',
      '🏰',
      '🏯',
      '🏟',
      '🎡',
      '🎢',
      '🎠',
      '⛱',
      '🏖',
      '🏝',
      '⛰',
      '🏔',
      '🗻',
      '🌋',
      '🏜',
      '🏕',
      '⛺️',
      '🛤',
      '🛣',
      '🏗',
      '🏭',
      '🏠',
      '🏡',
      '🏘',
      '🏚',
      '🏢',
      '🏬',
      '🏣',
      '🏤',
      '🏥',
      '🏦',
      '🏨',
      '🏪',
      '🏫',
      '🏩',
      '💒',
      '🏛',
      '⛪️',
      '🕌',
      '🕍',
      '🕋',
      '⛩',
      '🗾',
      '🎑',
      '🏞',
      '🌅',
      '🌄',
      '🌠',
      '🎇',
      '🎆',
      '🌇',
      '🌆',
      '🏙',
      '🌃',
      '🌌',
      '🌉',
      '🌁',
      '⌚️',
      '📱',
      '📲',
      '💻',
      '⌨️',
      '🖥',
      '🖨',
      '🖱',
      '🖲',
      '🕹',
      '🗜',
      '💽',
      '💾',
      '💿',
      '📀',
      '📼',
      '📷',
      '📸',
      '📹',
      '🎥',
      '📽',
      '🎞',
      '📞',
      '☎️',
      '📟',
      '📠',
      '📺',
      '📻',
      '🎙',
      '🎚',
      '🎛',
      '⏱',
      '⏲',
      '⏰',
      '🕰',
      '⌛️',
      '⏳',
      '📡',
      '🔋',
      '🔌',
      '💡',
      '🔦',
      '🕯',
      '🗑',
      '🛢',
      '💸',
      '💵',
      '💴',
      '💶',
      '💷',
      '💰',
      '💳',
      '💎',
      '⚖️',
      '🔧',
      '🔨',
      '⚒',
      '🛠',
      '⛏',
      '🔩',
      '⚙️',
      '⛓',
      '🔫',
      '💣',
      '🔪',
      '🗡',
      '⚔️',
      '🛡',
      '🚬',
      '⚰️',
      '⚱️',
      '🏺',
      '🔮',
      '📿',
      '💈',
      '⚗️',
      '🔭',
      '🔬',
      '🕳',
      '💊',
      '💉',
      '🌡',
      '🚽',
      '🚰',
      '🚿',
      '🛁',
      '🛀',
      '🛎',
      '🔑',
      '🗝',
      '🚪',
      '🛋',
      '🛏',
      '🛌',
      '🖼',
      '🛍',
      '🛒',
      '🎁',
      '🎈',
      '🎏',
      '🎀',
      '🎊',
      '🎉',
      '🎎',
      '🏮',
      '🎐',
      '✉️',
      '📩',
      '📨',
      '📧',
      '💌',
      '📥',
      '📤',
      '📦',
      '🏷',
      '📪',
      '📫',
      '📬',
      '📭',
      '📮',
      '📯',
      '📜',
      '📃',
      '📄',
      '📑',
      '📊',
      '📈',
      '📉',
      '🗒',
      '🗓',
      '📆',
      '📅',
      '📇',
      '🗃',
      '🗳',
      '🗄',
      '📋',
      '📁',
      '📂',
      '🗂',
      '🗞',
      '📰',
      '📓',
      '📔',
      '📒',
      '📕',
      '📗',
      '📘',
      '📙',
      '📚',
      '📖',
      '🔖',
      '🔗',
      '📎',
      '🖇',
      '📐',
      '📏',
      '📌',
      '📍',
      '📌',
      '🎌',
      '🏳️',
      '🏴',
      '🏁',
      '🌈',
      '🖊',
      '🖋',
      '✒️',
      '🖌',
      '🖍',
      '📝',
      '✏️',
      '🔍',
      '🔎',
      '🔏',
      '🔐',
      '🔒',
      '🔓',
    ];
    return emojis;
  };

  render() {
    const emojis = this.getEmojis();
    const listItems = emojis.map((emoji, i) => {
      return (
        <EmojiListItem key={i}>
          <div onClick={e => this.onChange(emoji)}>
            <span
              style={{ fontSize: '1.5rem', position: 'relative', top: '4px' }}
            >
              {emoji}
            </span>
          </div>
        </EmojiListItem>
      );
    });

    return (
      <EmojiDialog role="dialog">
        <EmojiGrandlist role="listbox">
          <EmojiCategoryList>
            {listItems}
          </EmojiCategoryList>
        </EmojiGrandlist>
      </EmojiDialog>
    );
  }
}

export default EmojiPicker;
