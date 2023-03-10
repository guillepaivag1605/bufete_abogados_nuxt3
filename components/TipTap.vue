<template>
    <div id="text-editor">
      <div class="toolbar" v-if="editor">
        <div class="align-dropdown">
          <button class="dropbtn">Título ▼</button>
          <div class="dropdown-content">
            <a v-for="index in 6"
              :class="{ active: editor.isActive('heading', { level: index }) }"
              :style="{ fontSize: 20 - index + 'px' }"
              @click="onHeadingClick(index)"
              role="button"
            >
              H{{ index }}
            </a>
          </div>
        </div>
  
        <button
          v-for="({ slug, option, active, icon }, index) in textActions"
          :class="{ active: editor.isActive(active) }"
          @click="onActionClick(slug, option)"
        >
          <span class="material-icons">
            {{ icon }}
          </span>
        </button>
      </div>
  
      <editor-content :editor="editor" />
  
      <div v-if="editor" class="footer">
        <span class="characters-count" :class="maxLimit ? limitWarning : ''">
          {{ charactersCount }}
          {{ maxLimit ? `/ ${maxLimit} characters` : 'characters' }}
        </span>
        |
        <span class="words-count"> {{ wordsCount }} words </span>
      </div>
    </div>
  </template>
  
  <script>
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import TextAlign from '@tiptap/extension-text-align';
  import Underline from '@tiptap/extension-underline';
  import Subscript from '@tiptap/extension-subscript';
  import Superscript from '@tiptap/extension-superscript';
  import CharacterCount from '@tiptap/extension-character-count';
  
  export default {
    components: {
      EditorContent,
    },
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      maxLimit: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        editor: null,
        textActions: [
          { slug: 'bold', icon: 'format_bold', active: 'bold' },
          { slug: 'italic', icon: 'format_italic', active: 'italic' },
          { slug: 'underline', icon: 'format_underlined', active: 'underline' },
          { slug: 'strike', icon: 'format_strikethrough', active: 'strike' },
          {
            slug: 'align',
            option: 'left',
            icon: 'format_align_left',
            active: { textAlign: 'left' },
          },
          {
            slug: 'align',
            option: 'center',
            icon: 'format_align_center',
            active: { textAlign: 'center' },
          },
          {
            slug: 'align',
            option: 'right',
            icon: 'format_align_right',
            active: { textAlign: 'right' },
          },
          {
            slug: 'align',
            option: 'justify',
            icon: 'format_align_justify',
            active: { textAlign: 'justify' },
          },
          { slug: 'bulletList', icon: 'format_list_bulleted', active: 'bulletList' },
          { slug: 'orderedList', icon: 'format_list_numbered', active: 'orderedList' },
          { slug: 'subscript', icon: 'subscript', active: 'subscript' },
          {
            slug: 'superscript',
            icon: 'superscript',
            active: 'superscript',
          },
          { slug: 'clear', icon: 'format_clear', active: 'clear' },
          { slug: 'undo', icon: 'undo', active: 'undo' },
          { slug: 'redo', icon: 'redo', active: 'redo' },
        ],
      };
    },
    computed: {
      charactersCount() {
        return this.editor.storage.characterCount.characters();
      },
      wordsCount() {
        return this.editor.storage.characterCount.words();
      },
      limitWarning() {
        const isCloseToMax = this.charactersCount >= this.maxLimit - 20;
        const isMax = this.charactersCount === this.maxLimit;
  
        if (isCloseToMax && !isMax) return 'warning';
        if (isMax) return 'danger';
  
        return '';
      },
    },
    watch: {
      modelValue(value) {
        if (this.editor.getHTML() === value) return;
        this.editor.commands.setContent(this.modelValue, false);
      },
    },
    methods: {
      onActionClick(slug, option = null) {
        const vm = this.editor.chain().focus();
        const actionTriggers = {
          bold: () => vm.toggleBold().run(),
          italic: () => vm.toggleItalic().run(),
          underline: () => vm.toggleUnderline().run(),
          strike: () => vm.toggleStrike().run(),
          bulletList: () => vm.toggleBulletList().run(),
          orderedList: () => vm.toggleOrderedList().run(),
          align: () => vm.setTextAlign(option).run(),
          subscript: () => vm.toggleSubscript().run(),
          superscript: () => vm.toggleSuperscript().run(),
          undo: () => vm.undo().run(),
          redo: () => vm.redo().run(),
          clear: () => {
            vm.clearNodes().run();
            vm.unsetAllMarks().run();
          },
        };
  
        actionTriggers[slug]();
      },
      onHeadingClick(index) {
        const vm = this.editor.chain().focus();
        vm.toggleHeading({ level: index }).run();
      },
    },
    mounted() {
      this.editor = new Editor({
        content: this.modelValue,
        extensions: [
          StarterKit,
          Underline,
          Subscript,
          Superscript,
          CharacterCount.configure({
            limit: this.maxLimit,
          }),
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
        ],
        onUpdate: () => {
          this.$emit('update:modelValue', this.editor.getHTML());
        },
      });
    },
    beforeUnmount() {
      this.editor.destroy();
    },
  };
  </script>

<style lang="less" scoped>
#text-editor {
  border: 1px solid #808080;

  .toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid #808080;

    > button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 20px;
      background: #fff;
      color: #333;
      border: none;
      border-radius: 2px;
      margin: 0.5em 4px;
      -webkit-appearance: none;
      cursor: pointer;

      &.active {
        background: #333;
        color: #fff;
      }
    }
  }

  .align-dropdown {
    position: relative;
    display: inline-block;
    margin: 0.5em 8px;

    > button {
      height: 32px;
      background: #fff;
      color: #333;
      border: none;
      border-radius: 2px;
      -webkit-appearance: none;
      cursor: pointer;
    }

    > .dropdown-content {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      border: 1px solid #333;
      outline: 1px solid #fff;
      border-radius: 2px;
      background-color: #fff;
      z-index: 1;

      a {
        display: block;
        padding: 6px 12px;
        text-align: center;
        cursor: pointer;

        &:hover,
        &.active {
          background: #333;
          color: #fff;
        }
      }
    }

    &:hover .dropdown-content {
      display: block;
    }
  }

  .divider {
    width: 1px;
    height: 24px;
    background: #333;
    margin-right: 6px;
  }

  .footer {
    color: #808080;
    font-size: 14px;
    text-align: right;
    padding: 6px;

    .characters-count {
      &.warning {
        color: orange;
      }

      &.danger {
        color: red;
      }
    }
  }
}
</style>

<style lang="less" >
.ProseMirror{}
</style>